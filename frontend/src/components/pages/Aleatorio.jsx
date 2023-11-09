import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [user, setUser] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false); // Nuevo estado para controlar el texto del botón
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      alert('Por favor, selecciona una imagen');
      return;
    }
    if (!user) {
      alert('Por favor, inicia sesión');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('uploadBy', user._id);
    formData.append('tags', e.target.tags.value);

    try {
      setUploading(true); // Cambiar el estado a "true" al comenzar la carga
      await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/');
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    } finally {
      setUploading(false); // Cambiar el estado a "false" al finalizar la carga (éxito o error)
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_AUTH}/api/auth/user`);
        setUser(response.data);
      } catch (error) {
        console.error(error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>Subir imagen</h1>
      <form onSubmit={handleFormSubmit}>
        <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
        {previewImage && <img src={previewImage} alt="Preview" style={{ maxWidth: '300px' }} />}
        <input type="text" name="tags" placeholder="Etiquetas" />
        
        <button type="submit" disabled={uploading}>
          {uploading ? 'SUBIENDO...' : 'Subir imagen'}
        </button>
      </form>
    </div>
  );
}

export default ImageUploader;
