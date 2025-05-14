import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { HeaderAdmin } from "../HeaderAdmin";

export const LeerCoches = () => {
  const location = useLocation();
  const [mensaje, setMensaje] = useState(false);
  const [coches, setCoches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("Admin"));

  const obtenerCoches = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/admin/${admin.idAdmin}/coches`
      );
      if (!response.ok) throw new Error("Error al obtener los coches");

      const data = await response.json();
      setCoches(data);
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudieron cargar los coches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin?.idAdmin) {
      obtenerCoches();
    }

    if (location.state?.operacion) {
      setMensaje(true);
    }
  }, []);

  const normalizarFecha = (fechaStr) => {
    if (!fechaStr) return "";
    return new Date(fechaStr).toISOString().split("T")[0];
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "Sin fecha";
    return new Date(fechaStr).toISOString().split("T")[0];
  };

  const cochesDesdeReparaciones = coches.flatMap((mecanico) =>
    (mecanico.reparaciones || []).map((r) => ({
      ...r.coche,
      reparacion: r,
      mecanico: {
        Nombre: mecanico.Nombre,
        Apellidos: mecanico.Apellidos,
      },
    }))
  );

  const cochesFiltrados = cochesDesdeReparaciones.filter((coche) => {
    const termino = busqueda.toLowerCase();
    const coincideBusqueda =
      coche.Matricula?.toLowerCase().includes(termino) ||
      coche.usuario?.nombre?.toLowerCase().includes(termino) ||
      coche.usuario?.apellidos?.toLowerCase().includes(termino) ||
      coche.mecanico?.Nombre?.toLowerCase().includes(termino);

    const coincideFecha =
      fechaFiltro === "" ||
      normalizarFecha(coche.reparacion.fechaInicio) === fechaFiltro;

    return coincideBusqueda && coincideFecha;
  });

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
          onClick={() => navigate("/employees/crud/coches/addreparacion")}
        >
          Recibir coche
        </button>
      </div>

      {mensaje && (
        <div className="alerta__login operacion__Exitosa">
          <span>¡Operación exitosa!</span>
          <button
            className="alerta__login-cerrar"
            onClick={() => setMensaje(false)}
          >
            X
          </button>
        </div>
      )}

      {loading ? (
        <p>Cargando coches...</p>
      ) : (
        <div className="lista-coches">
          {cochesFiltrados.map((coche, index) => {
            const mecanico = coche.mecanico
              ? `${coche.mecanico.Nombre} ${coche.mecanico.Apellidos}`
              : "No asignado";
            const fechaInicio = formatearFecha(coche.reparacion.fechaInicio);
            const fechaFin = formatearFecha(coche.reparacion.fechaFin);
            const reparacionesPendientes = cochesDesdeReparaciones.filter(
              (c) => c.id === coche.id && c.reparacion.estado !== "Finalizado"
            );

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
                  <div>
                    <strong>Cliente:</strong>{" "}
                    {coche.usuario
                      ? `${coche.usuario.nombre} ${coche.usuario.apellidos}`
                      : "Desconocido"}
                  </div>
                  <div>
                    <strong>Matrícula:</strong>{" "}
                    {coche.Matricula || "No registrada"}
                  </div>
                  <div>
                    <strong>Reparaciones pendientes:</strong>{" "}
                    {reparacionesPendientes.length}
                  </div>
                  <div>
                    <strong>Mecánico:</strong> {mecanico}
                  </div>
                  <div>
                    <strong>Entrada:</strong> {fechaInicio}
                  </div>
                  <div>
                    <strong>Salida:</strong> {fechaFin}
                  </div>
                  <div className="coche-botones">
                    <button
                      className="reparar"
                      onClick={() =>
                        navigate(`/employees/crud/coches/${coche.id}/detalle`)
                      }
                    >
                      Reparar
                    </button>
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
