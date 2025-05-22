import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const DetalleCoche = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coche, setCoche] = useState(null);
  const [reparaciones, setReparaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reparacionActiva, setReparacionActiva] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  console.log(coche)
  useEffect(() => {
    const obtenerCoche = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/user/coche/${id}/reparaciones`
        );
        if (!response.ok) throw new Error("Error al obtener datos del coche");
        const data = await response.json();
        setCoche(data);
        setReparaciones(data.reparaciones || []);
      } catch (error) {
        console.error("Error:", error);
        alert("No se pudieron cargar los datos del coche.");
      } finally {
        setLoading(false);
      }
    };

    obtenerCoche();
  }, [id]);

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/reparacion/${id}/estado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) {
        console.error("Error del servidor:", await res.text());
        alert("No se pudo actualizar el estado.");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error al conectar con el servidor.");
      return false;
    }
  };

  const handleComenzar = () => {
    localStorage.removeItem("CocheReparado");
    localStorage.setItem("estadoVehiculo", "🔧 Tu coche está siendo reparado");
    setReparacionActiva(true);
  };

  const handleFinalizarGlobal = async () => {
    localStorage.removeItem("estadoVehiculo");
    localStorage.setItem(
      "CocheReparado",
      "✅ Tu coche está listo para recoger"
    );
    setReparacionActiva(false);

    try {
      const facturaRes = await fetch(
        `http://127.0.0.1:8000/factura/generar/${coche.usuario.id}`,
        {
          method: "POST",
        }
      );

      if (!facturaRes.ok) {
        const data = await facturaRes.json();
        console.error("Error al generar la factura:", data.error);
      }

      const res = await fetch("http://127.0.0.1:8000/notificar/recogida", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: coche.usuario?.email,
          nombre: coche.usuario?.nombre,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMensajeExito("Correo enviado correctamente.");
      } else {
        console.error("Error al enviar correo:", data.error);
        alert("No se pudo enviar el correo al usuario.");
      }
    } catch (error) {
      console.error("Error en el proceso final:", error);
      alert("Hubo un problema al finalizar la reparación.");
    }
  };

  const handleFinalizar = async (index) => {
    const id = reparaciones[index].id;
    const ok = await actualizarEstado(id, "Finalizado");

    if (ok) {
      const nuevas = [...reparaciones];
      nuevas[index].estado = "Finalizado";
      setReparaciones(nuevas);
    }
  };

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
        <button className="volver" onClick={() => navigate(-1)}>
          Volver
        </button>
      </header>
      {mensajeExito && (
        <div className="alerta__login alerta__correo">
          <span>{mensajeExito}</span>
          <button
            className="alerta__login-cerrar"
            onClick={() => setMensajeExito("")}
          >
            X
          </button>
        </div>
      )}

      <div className="detalle-coche">
        <div className="coche-reparacion-wrapper">
          <div className="coche-detalle-card">
            <img
              src={
                coche.imagen
                  ? `http://127.0.0.1:8000/uploads/${coche.imagen}`
                  : "/placeholder.jpg"
              }
              alt="Coche"
              className="imagen-detalle"
            />

            <div className="info">
              <p>
                <strong>Cliente:</strong> {coche.usuario?.nombre}{" "}
                {coche.usuario?.apellidos}
              </p>
              <p>
                <strong>Matrícula:</strong> {coche.Matricula}
              </p>
              <p>
                <strong>Email:</strong> {coche.usuario?.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {coche.usuario?.telefono}
              </p>
              <p>
                <strong>Año:</strong> {coche.año || "No especificado"}
              </p>
            </div>
          </div>

          <div className="reparaciones-lista">
            <h3>Control de Reparaciones</h3>

            <div className="botones-generales">
              <button className="btn-comenzar-global" onClick={handleComenzar}>
                Comenzar Reparación
              </button>
              <button
                className="btn-finalizar-global"
                onClick={handleFinalizarGlobal}
              >
                Terminar Reparación
              </button>
            </div>

            {reparaciones.length > 0 ? (
              reparaciones.map((rep, index) => (
                <div key={rep.id} className="reparacion-card">
                  <p>
                    <strong>Estado:</strong> {rep.estado}
                  </p>
                  <p>
                    <strong>Mecánico:</strong>{" "}
                    {rep.mecanico
                      ? `${rep.mecanico.Nombre} ${rep.mecanico.Apellidos}`
                      : "No asignado"}
                  </p>
                  <p>
                    <strong>Descripción:</strong>{" "}
                    {rep.descripcion || "No hay descripción"}
                  </p>
                  <p>
                    <strong>Fecha Entrada:</strong>{" "}
                    {formatearFecha(rep.fechaInicio)}
                  </p>
                  <p>
                    <strong>Fecha Entrega:</strong>{" "}
                    {formatearFecha(rep.fechaFin)}
                  </p>
                  <div className="acciones">
                    <button
                      className="btn-actualizar"
                      onClick={() => handleFinalizar(index)}
                      disabled={!reparacionActiva}
                      style={{ opacity: reparacionActiva ? 1 : 0.5 }}
                    >
                      Hecho
                    </button>
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
