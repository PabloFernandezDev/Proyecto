import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const FormCoche = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    año: "",
    imagen: null,
    matricula: "",
  });

  const [preview, setPreview] = useState(null);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [errorMatricula, setErrorMatricula] = useState("");
  const añoActual = new Date().getFullYear();
  const [errorAño, setErrorAño] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/marca`)
      .then((res) => res.json())
      .then((data) => setMarcas(data))
      .catch((err) => console.error("Error cargando marcas:", err));
  }, []);

  useEffect(() => {
    if (formData.marca) {
      fetch(`${import.meta.env.VITE_API_URL}/marca/${formData.marca}/modelos`)
        .then((res) => res.json())
        .then((data) => setModelos(data))
        .catch((err) => console.error("Error cargando modelos:", err));
    } else {
      setModelos([]);
    }
  }, [formData.marca]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const newValue = name === "matricula" ? value.toUpperCase() : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === "marca" ? { modelo: "" } : {}),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, imagen: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const añoNum = parseInt(formData.año, 10);
    if (isNaN(añoNum) || añoNum < 1900 || añoNum > añoActual) {
      setErrorAño(`El año debe estar entre 1900 y ${añoActual}.`);
      return;
    }
    setErrorAño("");

    const matriculaRegex = /^\d{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$/i;
    if (!matriculaRegex.test(formData.matricula)) {
      setErrorMatricula(
        "La matrícula debe tener 4 números seguidos de 3 consonantes (sin vocales, Ñ o Q)."
      );
      return;
    }

    setErrorMatricula(""); 
    const data = new FormData();
    const userId = localStorage.getItem("user_id");

    data.append("marca", formData.marca);
    data.append("modelo", formData.modelo);
    data.append("año", formData.año);
    data.append("matricula", formData.matricula);
    data.append("usuario", userId);
    if (formData.imagen) data.append("imagen", formData.imagen);

    try {
      const response = await fetch("http://127.0.0.1:8000/coche", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (response.ok) {
        setFormData({
          marca: "",
          modelo: "",
          año: "",
          imagen: null,
          matricula: "",
        });
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
            type="text"
            name="matricula"
            placeholder="Matrícula"
            className="add-coche__input"
            value={formData.matricula}
            onChange={handleChange}
            required
          />
          {errorMatricula && <p className="form-error">{errorMatricula}</p>}

          <label className="add-coche__label">
            Año: {formData.año || añoActual}
          </label>
          <input
            type="range"
            name="año"
            min="1900"
            max={añoActual}
            className="add-coche__range"
            value={formData.año || añoActual}
            onChange={handleChange}
          />
          {errorAño && <p className="form-error">{errorAño}</p>}

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
