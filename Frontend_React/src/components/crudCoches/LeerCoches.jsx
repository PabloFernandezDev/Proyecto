import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HeaderAdmin } from "../Admin/HeaderAdmin";

export const LeerCoches = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [mensaje, setMensaje] = useState(false);
  const [coches, setCoches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const cochesPorPagina = 5;

  const obtenerCoches = async (adminId) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/${adminId}/coches`);
      if (!response.ok) throw new Error("Error al obtener coches");
      const data = await response.json();
      setCoches(data);
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudieron cargar los coches.");
    } finally {
      setLoading(false);
    }
  };

  const marcarComoDevuelto = async (id) => {
    console.log(id)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/coche/${id}/devolver`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Error al devolver el coche");

      setMensaje("Coche devuelto correctamente");
      obtenerCoches(admin.idAdmin); 
    } catch (error) {
      console.error("Error al devolver el coche:", error);
      alert("Error al devolver el coche.");
    }
  };

  useEffect(() => {
    const adminStorage = JSON.parse(localStorage.getItem("Admin"));
    if (adminStorage?.idAdmin) {
      setAdmin(adminStorage);
      obtenerCoches(adminStorage.idAdmin);
    }

    if (location.state?.operacion) {
      setMensaje(true);
      window.history.replaceState({}, document.title);
    }
  }, []);

  const normalizarFecha = (fechaStr) =>
    fechaStr ? new Date(fechaStr).toISOString().split("T")[0] : "";

  const formatearFecha = (fechaStr) =>
    fechaStr ? new Date(fechaStr).toISOString().split("T")[0] : "Sin fecha";

  const filtrados = coches.filter((coche) => {
    const termino = busqueda.toLowerCase();
    const coincideBusqueda =
      coche.Matricula?.toLowerCase().includes(termino) ||
      coche.usuario?.nombre?.toLowerCase().includes(termino) ||
      coche.usuario?.apellidos?.toLowerCase().includes(termino) ||
      coche.reparaciones?.some((r) =>
        r.mecanico?.Nombre?.toLowerCase().includes(termino)
      );

    const coincideFecha =
      fechaFiltro === "" ||
      coche.reparaciones?.some(
        (r) => normalizarFecha(r.fechaInicio) === fechaFiltro
      );

    return coincideBusqueda && coincideFecha;
  });

  const totalPaginas = Math.ceil(filtrados.length / cochesPorPagina);
  const cochesPaginados = filtrados.slice(
    (paginaActual - 1) * cochesPorPagina,
    paginaActual * cochesPorPagina
  );

  return (
    <div className="coches-panel">
      <HeaderAdmin />

      {mensaje && (
        <div className="alerta__login operacion__Exitosa">
          <span>{mensaje}</span>
          <button className="alerta__login-cerrar" onClick={() => setMensaje(false)}>X</button>
        </div>
      )}

      <div className="barra-superior">
        <input
          type="text"
          placeholder="Buscar por matrícula, cliente o mecánico..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <input
          type="date"
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.target.value)}
        />
        <button
          className="perfil__boton perfil__boton--volver"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>

      {loading ? (
        <p>Cargando coches...</p>
      ) : (
        <>
          <div className="lista-coches">
            {cochesPaginados.map((coche, index) => {
              const reparaciones = coche.reparaciones || [];
              const reparacionesPendientes = reparaciones.filter((r) => r.estado !== "Finalizado");
              const ultimaReparacion = reparaciones[reparaciones.length - 1] || {};
              const fechaInicio = formatearFecha(ultimaReparacion.fechaInicio);
              const fechaFin = formatearFecha(ultimaReparacion.fechaFin);
              const mecanico = ultimaReparacion.mecanico
                ? `${ultimaReparacion.mecanico.Nombre} ${ultimaReparacion.mecanico.Apellidos}`
                : "No asignado";

              const mostrarReparar =
                reparaciones.length > 0 && reparacionesPendientes.length > 0;
              const mostrarDevolver =
                coche.estado === "Revisión" ||
                coche.estado === "Listo" ||
                coche.estado === null ||
                coche.estado === "";

              return (
                <div className="coche-card" key={index}>
                  <img
                    src={
                      coche.imagen
                        ? `http://127.0.0.1:8000/uploads/${coche.imagen}`
                        : "/placeholder.jpg"
                    }
                    alt="Coche"
                    className="coche-imagen"
                  />
                  <div className="coche-info">
                    <div><strong>Cliente:</strong> {`${coche.usuario.nombre} ${coche.usuario.apellidos}`}</div>
                    <div><strong>Matrícula:</strong> {coche.Matricula}</div>
                    <div><strong>Total reparaciones:</strong> {reparaciones.length}</div>
                    <div><strong>Pendientes:</strong> {reparacionesPendientes.length}</div>
                    <div><strong>Fecha entrada:</strong> {fechaInicio}</div>
                    <div><strong>Fecha entrega:</strong> {fechaFin}</div>
                    <div><strong>Mecánico:</strong> {mecanico}</div>
                    {reparaciones.length === 0 && coche.estado === "Revisión" && (
                      <p style={{ color: "#c00", fontWeight: "bold" }}>
                        Este coche aún no tiene reparaciones registradas.
                      </p>
                    )}
                    <div className="coche-botones">
                      {mostrarReparar && (
                        <button
                          className="reparar"
                          onClick={() => navigate(`/employees/crud/coches/${coche.id}/detalle`)}
                        >
                          Reparar
                        </button>
                      )}
                      {mostrarDevolver && (
                        <button
                          className="devuelto"
                          onClick={() => marcarComoDevuelto(coche.id)}
                        >
                          Devolver
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="paginacion">
            <button
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual(paginaActual - 1)}
            >
              Anterior
            </button>
            <button
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual(paginaActual + 1)}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};
