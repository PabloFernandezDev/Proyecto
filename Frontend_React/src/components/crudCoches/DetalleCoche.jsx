import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const DetalleCoche = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coche, setCoche] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerCoche = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/user/coche/${id}/reparaciones`);
        if (!response.ok) throw new Error("Error al obtener datos del coche");
        const data = await response.json();
        setCoche(data);
      } catch (error) {
        console.error("Error:", error);
        alert("No se pudieron cargar los datos del coche.");
      } finally {
        setLoading(false);
      }
    };

    obtenerCoche();
  }, [id]);

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "Sin fecha";
    return new Date(fechaStr).toLocaleDateString("es-ES");
  };

  if (loading) return <p>Cargando coche...</p>;
  if (!coche) return <p>Coche no encontrado</p>;

  return (
    <div>
        <header className="admin-header">
            <span>Detalles del Coche</span>
            <button className="volver" onClick={() => navigate(-1)}>Volver</button>
        </header>
        <div className="detalle-coche">

        <div className="coche-reparacion-wrapper">
            <div className="coche-detalle-card">
            <img
                src={coche.imagen ? `http://127.0.0.1:8000/uploads/${coche.imagen}` : "/placeholder.jpg"}
                alt="Coche"
                className="imagen-detalle"
            />

            <div className="info">
                <p><strong>Cliente:</strong> {coche.usuario?.nombre} {coche.usuario?.apellidos}</p>
                <p><strong>Matrícula:</strong> {coche.Matricula}</p>
                <p><strong>Email:</strong> {coche.usuario?.email}</p>
                <p><strong>Teléfono:</strong> {coche.usuario?.telefono}</p>
                <p><strong>Año:</strong> {coche.año || "No especificado"}</p>
            </div>
            </div>

            <div className="reparaciones-lista">
            <h3>Historial de Reparaciones</h3>
            {coche.reparaciones && coche.reparaciones.length > 0 ? (
                coche.reparaciones.map((rep, index) => (
                <div key={index} className="reparacion-card">
                    <p><strong>Estado:</strong> {rep.estado}</p>
                    <p><strong>Mecánico:</strong> {rep.mecanico ? `${rep.mecanico.Nombre} ${rep.mecanico.Apellidos}` : "No asignado"}</p>
                    <p><strong>Inicio:</strong> {formatearFecha(rep.fechaInicio)}</p>
                    <p><strong>Fin:</strong> {formatearFecha(rep.fechaFin)}</p>
                    <div className="acciones">
                    <button className="btn-comenzar">Comenzar</button>
                    <button className="btn-finalizar">Finalizar</button>
                    </div>
                </div>
                ))
            ) : (
                <p>Este coche no tiene reparaciones registradas.</p>
            )}
            </div>
        </div>
        </div>
    </div>
  );
};
