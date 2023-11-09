import express from "express";
import multer from "multer";
import { createImage, getImages } from "../controllers/images.js";
import { nanoid } from 'nanoid';
import Image from '../models/images.js';
/*  */
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: async function (req, file, cb) {
    const uniqueKey = async () => {
      const id = nanoid(8);
      const key = await Image.findOne({ key: id });
      if (key) {
        return uniqueKey();
      }
      return id;
    };

    const filename = `${await uniqueKey()}.${file.originalname.split('.').pop()}`;
    
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// Rutas
router.get("/", getImages);

router.post("/upload", upload.single("image"), createImage);

router.post('/favorites', async (req, res) => {
    try {
      const { favoriteIds } = req.body;
  
      // Buscar las imágenes favoritas por sus IDs en la base de datos
      const images = await Image.find({ _id: { $in: favoriteIds } });
        
      res.json(images);
    } catch (error) {
      console.error('Error fetching favorite images:', error);
      res.status(500).json({ message: 'Error fetching favorite images' });
    }
  });

  router.delete('/:imageId', async (req, res) => {
    try {
      const { imageId } = req.params;
      const image = await Image.findById(imageId);
      const { thumbnail, original } = image.image;
      const thumbFilename = thumbnail.split('/').pop();
      const originalFilename = original.split('/').pop();
      const thumbPath = `uploads/${thumbFilename}`;
      const imagePath = `uploads/${originalFilename}`;
  
      await Promise.all([
        fs.unlink(thumbPath, (err) => { if (err) throw err; } ),
        fs.unlink(imagePath, (err) => { if (err) throw err; }),
        Image.findByIdAndDelete(imageId)
      ]);
  
      console.log('Imágenes eliminadas exitosamente.');
      res.json({ message: 'Imagen eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      res.status(500).json({ message: 'Error al eliminar la imagen' });
    }
  });
  
  /* obtener una sola imagen con el id */
  router.get('/:imageId', async (req, res) => {
    try {
      const imageId = req.params.imageId;
      const image = await Image.findById(imageId);

      res.json(image);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener la imagen' });
    }
  });

export default router;