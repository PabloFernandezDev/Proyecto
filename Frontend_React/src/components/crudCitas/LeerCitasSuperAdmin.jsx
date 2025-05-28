import React, { useEffect, useState } from "react";
import { HeaderAdmin } from "../HeaderAdmin";
import { useNavigate } from "react-router-dom";

export const LeerCitasSuperAdmin = () => {
  const [citas, setCitas] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const citasPorPagina = 10;

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/citas`)
      .then((res) => res.json())
      .then(setCitas)
      .catch((err) => console.error("Error al cargar citas:", err));
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [filtroNombre, filtroFecha]);

  const eliminarCita = async (id) => {
    if (!window.confirm("¿Eliminar esta cita?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/cita/${id}/delete`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Error desconocido");
      }

      setCitas((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message);
      console.error("Error al eliminar cita:", err);
    }
  };

  const citasFiltradas = citas.filter((cita) => {
    const nombreCompleto = `${cita.usuario?.nombre ?? ""} ${
      cita.usuario?.apellidos ?? ""
    }`.toLowerCase();
    const fecha = cita.fecha?.split("T")[0] || "";

    const coincideNombre = nombreCompleto.includes(filtroNombre.toLowerCase());
    const coincideFecha = !filtroFecha || fecha === filtroFecha;

    return coincideNombre && coincideFecha;
  });

  const totalPaginas = Math.ceil(citasFiltradas.length / citasPorPagina);
  const indiceInicio = (paginaActual - 1) * citasPorPagina;
  const citasEnPagina = citasFiltradas.slice(
    indiceInicio,
    indiceInicio + citasPorPagina
  );

  return (
    <div>
      <HeaderAdmin />
      <div className="leer-users">
        <h2>Todas las Citas</h2>
        <button
          className="btn-volver"
          onClick={() => navigate("/employees/admin/panel")}
        >
          Volver al Panel
        </button>
        <div className="filtros-superiores">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            className="buscador"
          />
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="buscador"
          />
        </div>

        <div className="tabla-contenedor">
          <table className="tabla-usuarios">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citasEnPagina.map((cita) => (
                <tr key={cita.id}>
                  <td>
                    {cita.usuario?.nombre} {cita.usuario?.apellidos}
                  </td>
                  <td>{cita.fecha?.split("T")[0]}</td>
                  <td>{cita.hora?.split("T")[1]?.substring(0, 5)}</td>
                  <td>{cita.motivo}</td>
                  <td>{cita.estado}</td>
                  <td>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarCita(cita.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {citasFiltradas.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No se encontraron citas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="paginacion">
            <button
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
            >
              Anterior
            </button>
            <button
              onClick={() =>
                setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
              }
              disabled={paginaActual === totalPaginas || totalPaginas === 0}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
