import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HeaderAdmin } from "../HeaderAdmin";

export const LeerCoches = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [mensaje, setMensaje] = useState(false);
  const [reparaciones, setReparaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");

  const admin = JSON.parse(localStorage.getItem("Admin"));

  const obtenerReparaciones = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/${admin.idAdmin}/coches`);
      if (!response.ok) throw new Error("Error al obtener las reparaciones");
      const data = await response.json();
      setReparaciones(data);
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudieron cargar las reparaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin?.idAdmin) {
      obtenerReparaciones();
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

  const cocheMap = new Map();
  reparaciones.forEach((reparacion) => {
    const coche = reparacion.coche;
    const cocheId = coche.id;

    if (!cocheMap.has(cocheId)) {
      cocheMap.set(cocheId, {
        coche,
        reparaciones: [],
      });
    }

    cocheMap.get(cocheId).reparaciones.push(reparacion);
  });

  const cochesUnicos = Array.from(cocheMap.values());

  return (
    <div className="coches-panel">
      <HeaderAdmin />

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

      {mensaje && (
        <div className="alerta__login operacion__Exitosa">
          <span>¡Operación exitosa!</span>
          <button className="alerta__login-cerrar" onClick={() => setMensaje(false)}>X</button>
        </div>
      )}

      {loading ? (
        <p>Cargando coches...</p>
      ) : (
        <div className="lista-coches">
          {cochesUnicos
            .filter(({ coche, reparaciones }) => {
              const termino = busqueda.toLowerCase();
              const coincideBusqueda =
                coche.Matricula?.toLowerCase().includes(termino) ||
                coche.usuario?.nombre?.toLowerCase().includes(termino) ||
                coche.usuario?.apellidos?.toLowerCase().includes(termino) ||
                reparaciones.some((r) =>
                  r.mecanico?.Nombre?.toLowerCase().includes(termino)
                );

              const coincideFecha =
                fechaFiltro === "" ||
                reparaciones.some(
                  (r) => normalizarFecha(r.fechaInicio) === fechaFiltro
                );

              return coincideBusqueda && coincideFecha;
            })
            .map(({ coche, reparaciones }, index) => {
              const reparacionesPendientes = reparaciones.filter(
                (r) => r.estado !== "Finalizado"
              );
              const ultimaReparacion = reparaciones[reparaciones.length - 1] || {};
              const fechaInicio = formatearFecha(ultimaReparacion.fechaInicio);
              const fechaFin = formatearFecha(ultimaReparacion.fechaFin);
              const mecanico = ultimaReparacion.mecanico
                ? `${ultimaReparacion.mecanico.Nombre} ${ultimaReparacion.mecanico.Apellidos}`
                : "No asignado";

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
                    <div className="coche-botones">
                      {reparacionesPendientes.length === 0 ? (
                        <button className="devuelto" onClick={() => marcarComoDevuelto(coche.id)}>Devolver</button>
                      ) : (
                        <button className="reparar" onClick={() => navigate(`/employees/crud/coches/${coche.id}/detalle`)}>Reparar</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
