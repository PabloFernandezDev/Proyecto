import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCar } from "react-icons/fa";
import { FiTrash2, FiArrowLeft } from "react-icons/fi";
import { Header } from "../Diseño/Header";

export const CocheDetails = () => {
  const [coche, setCoche] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    fetch(`${import.meta.env.VITE_API_URL}/user/${userId}/coche`)
      .then((res) => res.json())
      .then((data) => setCoche(data))
      .catch((err) => console.error("Error cargando coche:", err));
  }, []);

  const handleDelete = async () => {
    const confirmacion = window.confirm(
      "¿Seguro que quieres eliminar este coche?"
    );
    if (!confirmacion) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/coche/${coche.id}/delete`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        navigate("/home");
      } else {
        console.error("Error al eliminar coche:", await response.text());
      }
    } catch (err) {
      console.error("Error al eliminar coche:", err);
    }
  };
  return (
    <>
      <Header />
      <div className="detalle-coche-container">
        <h2 className="detalle-coche-titulo">
          <FaCar /> Detalles del Coche
        </h2>
        {coche ? (
          <div className="detalle-coche-grid">
            <div className="detalle-coche-imagen">
              <img
                src={`http://127.0.0.1:8000/uploads/${coche.imagen}`}
                alt="Imagen del coche"
              />
            </div>
            <div className="detalle-coche-info">
              <p>
                <strong>Marca:</strong> {coche.marca.nombre}
              </p>
              <p>
                <strong>Modelo:</strong> {coche.modelo.nombre}
              </p>
              <p>
                <strong>Año:</strong> {coche.año}
              </p>
              <h3 className="detalle-coche-subtitulo">Propietario</h3>
              <p>
                <strong>Nombre:</strong> {coche.usuario.nombre}{" "}
                {coche.usuario.apellidos}
              </p>
              <p>
                <strong>Email:</strong> {coche.usuario.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {coche.usuario.telefono}
              </p>
              <p>
                <strong>DNI:</strong> {coche.usuario.dni}
              </p>
              <div className="detalle-coche-botones">
                <button className="boton eliminar" onClick={handleDelete}>
                  <FiTrash2 /> Eliminar Coche
                </button>
                <button
                  className="boton volver"
                  onClick={() => navigate("/home")}
                >
                  <FiArrowLeft /> Volver
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>Cargando detalles del coche...</p>
        )}
      </div>
    </>
  );
};
