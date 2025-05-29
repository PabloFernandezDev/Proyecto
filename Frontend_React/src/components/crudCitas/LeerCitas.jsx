import React, { useEffect, useState } from "react";
import { HeaderAdmin } from "../Admin/HeaderAdmin";
import { useNavigate, useLocation } from "react-router-dom";

export const LeerCitas = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [operacionExitosa, setOperacionExitosa] = useState(false);
  const [vista, setVista] = useState("pendientes");
  const [paginaActual, setPaginaActual] = useState(1);
  const citasPorPagina = 10;

  const admin = JSON.parse(localStorage.getItem("Admin"));

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "Sin fecha";
    const fecha = new Date(fechaStr);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = fecha.getFullYear();
    return `${dia}-${mes}-${año}`;
  };

  useEffect(() => {
    const obtenerCitas = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/admin/${admin.idAdmin}/taller/${
            admin.provincia.id
          }/citas`
        );
        if (!res.ok) throw new Error("Error al obtener las citas");
        const data = await res.json();
        setCitas(data);
      } catch (error) {
        console.error("Error:", error);
        alert("No se pudieron cargar las citas.");
      } finally {
        setLoading(false);
      }
    };

    if (admin?.idAdmin && admin?.provincia?.id) {
      obtenerCitas();
    }

    if (location.state?.operacionExitosa) {
      setOperacionExitosa(true);
      window.history.replaceState({}, document.title);
    }
  }, []);

  const citasFiltradas = citas.filter((cita) => {
    const termino = busqueda.toLowerCase();
    const coincideBusqueda =
      cita.usuario?.nombre?.toLowerCase().includes(termino) ||
      cita.usuario?.apellidos?.toLowerCase().includes(termino) ||
      (cita.usuario?.coches?.[0]?.Matricula || "")
        .toLowerCase()
        .includes(termino);
    const coincideFecha =
      fechaFiltro === "" || formatearFecha(cita.fecha) === fechaFiltro;

    const esPendiente = cita.estado !== "Entregar";
    const esRecogida = cita.estado === "Entregar";

    return (
      coincideBusqueda &&
      coincideFecha &&
      ((vista === "pendientes" && esPendiente) ||
        (vista === "recoger" && esRecogida))
    );
  });

  const totalPaginas = Math.ceil(citasFiltradas.length / citasPorPagina);
  const indiceInicio = (paginaActual - 1) * citasPorPagina;
  const indiceFin = indiceInicio + citasPorPagina;
  const citasPaginadas = citasFiltradas.slice(indiceInicio, indiceFin);

  const handleBorrar = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas borrar esta cita?"))
      return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/cita/${id}/delete`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setCitas((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("No se pudo eliminar la cita.");
      }
    } catch (err) {
      console.error("Error al borrar la cita:", err);
      alert("Error al borrar la cita.");
    }
  };

  return (
    <div>
      <HeaderAdmin />
      <div className="leer-users">
        <h2>Citas del Taller</h2>
        <div className="filtros-superiores">
          <input
            type="text"
            placeholder="Buscar por nombre o matrícula..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="buscador"
          />
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="selector-provincia"
          />
          <button onClick={() => setVista("pendientes")} className="btn-volver">
            Recibir
          </button>
          <button onClick={() => setVista("recoger")} className="btn-volver">
            Entregar
          </button>
          <button
            onClick={() => navigate("/employees/admin/panel")}
            className="btn-volver"
          >
            Volver
          </button>
        </div>

        {operacionExitosa && (
          <div className="alerta__login alerta__citas">
            <span>¡Operación con éxito!</span>
            <button onClick={() => setOperacionExitosa(false)}>X</button>
          </div>
        )}

        {loading ? (
          <p>Cargando citas...</p>
        ) : citasFiltradas.length === 0 ? (
          <p>No hay citas registradas.</p>
        ) : (
          <div className="tabla-contenedor">
            <table className="tabla-usuarios">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Matrícula</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                  <th>Consentimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citasPaginadas.map((cita, index) => {
                  const fecha = formatearFecha(cita.fecha);
                  const hora = cita.hora?.split("T")[1]?.slice(0, 5) || "";
                  const matricula =
                    cita.usuario?.coches?.[0]?.Matricula || "N/A";

                  return (
                    <tr key={index}>
                      <td>
                        {cita.usuario?.nombre} {cita.usuario?.apellidos}
                      </td>
                      <td>{fecha}</td>
                      <td>{hora}</td>
                      <td>{matricula}</td>
                      <td>{cita.motivo}</td>
                      <td>{cita.estado}</td>
                      <td>
                        {cita.consentimientoAceptado
                          ? "Aceptado"
                          : "No aceptado"}
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            navigate(`/employees/crud/citas/${cita.id}/detalle`)
                          }
                          className="btn-detalles"
                        >
                          Detalles
                        </button>
                        <button
                          onClick={() => handleBorrar(cita.id)}
                          className="btn-borrar"
                        >
                          Borrar
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
        )}
      </div>
    </div>
  );
};
