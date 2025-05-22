import React, { useEffect, useState } from "react";
import { HeaderAdmin } from "../HeaderAdmin";
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
  const admin = JSON.parse(localStorage.getItem("Admin"));
  console.log(citas)
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
          `${import.meta.env.VITE_API_URL}/admin/${admin.idAdmin}/taller/${admin.provincia.id}/citas`
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
      (cita.usuario?.coches?.[0]?.Matricula || "").toLowerCase().includes(termino);
    const coincideFecha =
      fechaFiltro === "" || formatearFecha(cita.fecha) === fechaFiltro;

    const esPendiente = cita.estado !== "Entregar";
    const esRecogida = cita.estado === "Entregar";

    return coincideBusqueda && coincideFecha && (
      (vista === "pendientes" && esPendiente) ||
      (vista === "recoger" && esRecogida)
    );
  });

  const handleBorrar = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas borrar esta cita?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cita/${id}/delete`, {
        method: "DELETE",
      });

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
      <div className="citas-panel">
        <div className="barra-superior">
          <input
            type="text"
            placeholder="Buscar por nombre o matrícula..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />
          <div className="botones-vista">
            <button onClick={() => setVista("pendientes")}>Citas Recibir Coche</button>
            <button onClick={() => setVista("recoger")}>Citas Entregar Coche</button>
            <button onClick={() => navigate("/employees/admin/panel")} className="btn-volver">
          Volver
        </button>
          </div>
          
        </div>
        

        {loading ? (
          <p>Cargando citas...</p>
        ) : citasFiltradas.length === 0 ? (
          <p>No hay citas registradas.</p>
        ) : (
          <div>
            <div className="citas-header">
              <h2>{vista === "pendientes" ? "Citas Recibir Coche" : "Citas Entregar Coche"}</h2>
            </div>
            {operacionExitosa && (
              <div className="alerta__login alerta__citas">
                <span>¡Operación con éxito!</span>
                <button
                  className="alerta__login-cerrar"
                  onClick={() => setOperacionExitosa(false)}
                >
                  X
                </button>
              </div>
            )}
            <div className="lista-citas">
              {citasFiltradas.map((cita, index) => {
                const fecha = formatearFecha(cita.fecha);
                const hora = cita.hora?.split("T")[1]?.slice(0, 5) || "";
                const matricula = cita.usuario?.coches?.[0]?.Matricula || "N/A";

                return (
                  <div className="tarjeta-cita" key={index}>
                    <div>
                      <strong>Usuario:</strong> {cita.usuario?.nombre} {cita.usuario?.apellidos}
                    </div>
                    <div>
                      <strong>Fecha:</strong> {fecha}
                    </div>
                    <div>
                      <strong>Hora:</strong> {hora}
                    </div>
                    <div>
                      <strong>Matrícula:</strong> {matricula}
                    </div>
                    <div>
                      <strong>Motivo:</strong> {cita.motivo}
                    </div>
                    <div>
                      <strong>Estado:</strong> {cita.estado}
                    </div>
                    <div className="cita-botones">
                      <button
                        onClick={() => navigate(`/employees/crud/citas/${cita.id}/detalle`)}
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
