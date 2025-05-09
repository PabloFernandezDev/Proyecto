import React, { useState } from 'react';

export const Prueba = () => {
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleFileChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imagen) {
      setMensaje('Por favor selecciona una imagen');
      return;
    }

    const formData = new FormData();
    formData.append('imagen', imagen);

    try {
      const response = await fetch('http://127.0.0.1:8000/test-upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setMensaje(`Imagen subida correctamente: ${result.archivo}`);
      } else {
        setMensaje(result.detail || 'Error al subir imagen');
      }
    } catch (error) {
      console.error('Error en el envío:', error);
      setMensaje('Error de conexión con el servidor');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Test Subida de Imagen</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Subir Imagen</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};
