import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HeaderAdmin } from "../HeaderAdmin";

export const DetalleCita = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cita, setCita] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatearFecha = (fechaStr) =>
    fechaStr ? new Date(fechaStr).toISOString().split("T")[0] : "Sin fecha";

  const formatearHora = (horaStr) =>
    horaStr ? horaStr.split("T")[1]?.slice(0, 5) : "Sin hora";

  useEffect(() => {
    const obtenerCita = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/cita/${id}`);
        if (!res.ok) throw new Error("Error al obtener la cita");
        const data = await res.json();
        setCita(data);
      } catch (error) {
        console.error("Error:", error);
        alert("No se pudo cargar la cita.");
      } finally {
        setLoading(false);
      }
    };

    obtenerCita();
  }, [id]);

  if (loading) return <p>Cargando cita...</p>;
  if (!cita) return <p>No se encontró la cita.</p>;

  const matricula = cita.usuario?.coches?.[0]?.Matricula || "N/A";
  const nombre = `${cita.usuario?.nombre || ""} ${
    cita.usuario?.apellidos || ""
  }`;
  const fecha = formatearFecha(cita.fecha);
  const hora = formatearHora(cita.hora);

  return (
    <div className="detalle-cita-panel">
      <HeaderAdmin />
      <div className="detalle-cita-card">
        <h2>🗓️ Detalles de la Cita</h2>
        <p>
          <strong>Cliente:</strong> {nombre}
        </p>
        <p>
          <strong>Matrícula:</strong> {matricula}
        </p>
        <p>
          <strong>Fecha:</strong> {fecha}
        </p>
        <p>
          <strong>Hora:</strong> {hora}
        </p>
        <p>
          <strong>Motivo:</strong> {cita.motivo}
        </p>
        <button onClick={() => navigate(-1)} className="btn-volver">
          Volver
        </button>
        <button
          onClick={() =>
            navigate("/employees/crud/coches/addreparacion", {
              state: {
                coche: cita.usuario?.coches?.[0],
                usuario: cita.usuario,
                motivo: cita.motivo,
                citaId: cita.id,
                fechaInicio: cita.fecha,
              },
            })
          }
          className="btn-actualizar"
        >
          Actualizar cita y registrar reparación
        </button>
      </div>
    </div>
  );
};
