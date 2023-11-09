import Image from '../models/images.js';
import sharp from 'sharp';

export const getImages = async (req, res) => {
    try {
        const images = await Image.find();
        res.status(200).json(images);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// Controlador para crear una imagen
export const createImage = async (req, res) => {
  // Validar si se proporcionó una imagen
  if (!req.file) {
    return res.status(400).send('No se ha proporcionado ninguna imagen');
  }
  console.log('req.body:', req.body);
  const imageName = req.file.filename;
  console.log('imageName:', imageName);

  const image = {
    image: {
      original: `${process.env.SAVE_PATH}/api/uploads/${imageName}`,
      thumbnail: `${process.env.SAVE_PATH}/api/uploads/thumb_${imageName}`
    },
    key: imageName,
    tags: req.body.tags.split(',').map(tag => tag.trim()),
    favorites: null,
    uploadBy: req.body.uploadBy
  };

  const newImage = new Image(image);
  const resizedImagePath = `uploads/thumb_${imageName}`;

  try {
    await sharp(req.file.path)
      .resize(236, null)
      .toFile(resizedImagePath);

    await newImage.save();

    return res.status(201).json(newImage);
  } catch (error) {
    console.error('Error al redimensionar la imagen:', error);
    return res.status(500).send('Error al redimensionar la imagen');
  }
};

/* obtener una imagen */
export const getImage = async (req, res) => {
    const { id } = req.params;
    try {
        const image = await Image.findById(id);
        res.status(200).json(image);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}