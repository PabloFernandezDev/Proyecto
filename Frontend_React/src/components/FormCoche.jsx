import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const FormCoche = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    año: "",
    imagen: null,
  });

  const [preview, setPreview] = useState(null);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);

  // Cargar marcas al inicio
  useEffect(() => {
    fetch("http://127.0.0.1:8000/marca")
      .then((res) => res.json())
      .then((data) => setMarcas(data))
      .catch((err) => console.error("Error cargando marcas:", err));
  }, []);

  // Cargar modelos cuando se elige una marca
  useEffect(() => {
    if (formData.marca) {
      fetch(`http://127.0.0.1:8000/marca/${formData.marca}/modelos`)
        .then((res) => res.json())
        .then((data) => setModelos(data))
        .catch((err) => console.error("Error cargando modelos:", err));
    } else {
      setModelos([]);
    }
  }, [formData.marca]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "marca" ? { modelo: "" } : {}), // Resetear modelo si cambia la marca
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, imagen: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    const userId = localStorage.getItem("user_id");

    data.append("marca", formData.marca);
    data.append("modelo", formData.modelo);
    data.append("año", formData.año);
    data.append("usuario", userId); // <- Añadimos aquí el ID
    if (formData.imagen) data.append("imagen", formData.imagen);

    try {
      const response = await fetch("http://127.0.0.1:8000/coche", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (response.ok) {
        setFormData({ marca: "", modelo: "", año: "", imagen: null });
        setPreview(null);
        navigate("/home", { state: { cocheAñadido: true } });
      } else {
        alert(result.detail || "Error al añadir coche");
      }
    } catch (error) {
      console.error("Error en el envío:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="form-background">
      <div className="add-coche">
        <h2 className="add-coche__titulo">Añadir un Coche</h2>
        <form
          className="add-coche__formulario"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <select
            name="marca"
            className="add-coche__input"
            value={formData.marca}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una marca</option>
            {marcas.map((marca, i) => (
              <option key={i} value={marca.nombre}>
                {marca.nombre}
              </option>
            ))}
          </select>

          <select
            name="modelo"
            className="add-coche__input"
            value={formData.modelo}
            onChange={handleChange}
            required
            disabled={!formData.marca}
          >
            <option value="">Selecciona un modelo</option>
            {modelos.map((modelo, i) => (
              <option key={i} value={modelo.nombre}>
                {modelo.nombre}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="año"
            placeholder="Año"
            className="add-coche__input"
            value={formData.año}
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
    </div>
  );
};
