import React, { useState } from 'react';

export const FormCoche = () => {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    año: '',
    descripcion: '',
    imagen: null,
  });

  const [preview, setPreview] = useState(null); // <- Para la previsualización


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, imagen: file }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('marca', formData.marca);
    data.append('modelo', formData.modelo);
    data.append('año', formData.año);
    data.append('descripcion', formData.descripcion);
    if (formData.imagen) {
      data.append('imagen', formData.imagen);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/coche', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        alert('Coche añadido correctamente');
        setFormData({ marca: '', modelo: '', año: '', descripcion: '', imagen: null });
      } else {
        alert(result.detail || 'Error al añadir coche');
      }
    } catch (error) {
      console.error('Error en el envío:', error);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div className="add-coche">
      <h2 className="add-coche__titulo">Añadir un Coche</h2>
      <form className="add-coche__formulario" onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="marca"
          placeholder="Marca"
          className="add-coche__input"
          value={formData.marca}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="modelo"
          placeholder="Modelo"
          className="add-coche__input"
          value={formData.modelo}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="año"
          placeholder="Año"
          className="add-coche__input"
          value={formData.año}
          onChange={handleChange}
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          className="add-coche__textarea"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          accept="image/*"
          className="add-coche__file"
          onChange={handleFileChange}
        />
        {preview && (
          <div className="add-coche__preview">
            <img src={preview} alt="Previsualización" />
          </div>
        )}
        
        <button type="submit" className="boton add-coche__boton">
          Guardar Coche
        </button>
      </form>
    </div>
  );
};
