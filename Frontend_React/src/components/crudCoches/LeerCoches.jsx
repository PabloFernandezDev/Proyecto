import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const LeerCoches = () => {
  const [coches, setCoches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  const obtenerCoches = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/users/coches");
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
    obtenerCoches();
  }, []);

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "Sin fecha";
    return new Date(fechaStr).toLocaleDateString("es-ES");
  };

  const handleReparar = (cocheId) => {
    alert(`Iniciar reparación para coche con ID ${cocheId}`);
  };

  console.log(coches);
  return (
    <div className="coches-panel">
      <header className="admin-header">
        <span>Panel de Control</span>
        <span>Admin</span>
      </header>

      {mensaje && <div className="alerta-exito">{mensaje}</div>}

      {loading ? (
        <p>Cargando coches...</p>
      ) : (
        <>
          <div className="lista-coches">
            {coches.map((coche, index) => {
              const reparacionesPendientes =
                coche.reparaciones?.filter((r) => r.estado !== "Finalizado") ||
                [];
              const tieneReparaciones =
                coche.reparaciones && coche.reparaciones.length > 0;
              const ultima =
                coche.reparaciones?.[coche.reparaciones.length - 1];

              const estado = ultima?.estado || "Sin reparaciones";
              const mecanico = ultima?.mecanico
                ? `${ultima.mecanico.Nombre} ${ultima.mecanico.Apellidos}`
                : "No asignado";
              const fechaInicio = formatearFecha(ultima?.fechaInicio);
              const fechaFin = formatearFecha(ultima?.fechaFin);

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
                      <strong>Estado:</strong>{" "}
                      <span
                        className={`estado ${estado
                          .toLowerCase()
                          .replace(/\s/g, "_")}`}
                      >
                        {estado}
                      </span>
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
                    <div>
                      <strong>Reparaciones pendientes:</strong>{" "}
                      {reparacionesPendientes.length}
                    </div>
                    <div className="coche-botones">
                      <button
                        className="reparar"
                        onClick={() =>
                          navigate(`/employees/crud/coches/${coche.id}/detalle`)
                        }
                        disabled={
                          !coche.reparaciones || coche.reparaciones.length === 0
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

          <div className="paginacion">
            <button className="nav">Anterior</button>
            <button className="nav">Siguiente</button>
          </div>
        </>
      )}
    </div>
  );
};
