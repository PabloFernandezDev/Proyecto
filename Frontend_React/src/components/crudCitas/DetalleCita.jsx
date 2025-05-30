import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HeaderAdmin } from "../Admin/HeaderAdmin";
import { useNotificacionesStore } from "../../store/useNotificacionesStore";

export const DetalleCita = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { dispararRecarga } = useNotificacionesStore();

  const [cita, setCita] = useState(null);
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [horaEntrega, setHoraEntrega] = useState("");
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  console.log(admin)
  const horasDisponibles = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
  ];

  useEffect(() => {
    setAdmin(JSON.parse(localStorage.getItem("Admin")));

    const fetchDatos = async () => {
      try {
        const resCita = await fetch(
          `${import.meta.env.VITE_API_URL}/cita/${id}`
        );
        if (!resCita.ok) throw new Error("Error al cargar la cita");
        const data = await resCita.json();
        setCita(data);
        setFechaEntrega(data.fecha.split("T")[0]);
        setHoraEntrega(data.hora.split("T")[1].substring(0, 5));
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
      }
    };

    fetchDatos();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resCita = await fetch(
        `${import.meta.env.VITE_API_URL}/cita/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fechaEntrega,
            horaEntrega,
            estado: "Confirmar",
          }),
        }
      );

      if (!resCita.ok) {
        const errorData = await resCita.json();
        console.error("❌ Error PATCH /cita:", errorData);
        alert(
          `Error al actualizar cita: ${
            errorData.detail || JSON.stringify(errorData)
          }`
        );
        return;
      }

      const resCoche = await fetch(
        `${import.meta.env.VITE_API_URL}/coche/${
          cita.usuario.coches[0].id
        }/recibir`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taller: admin?.taller?.id || null,
            estado: "Revisión",
          }),
        }
      );

      if (!resCoche.ok) {
        const errorData = await resCoche.json();
        console.error("❌ Error PATCH /coche:", errorData);
        alert(
          `Error al actualizar el coche: ${
            errorData.error || JSON.stringify(errorData)
          }`
        );
        return;
      }

      const resNotif = await fetch(
        `${import.meta.env.VITE_API_URL}/notificacion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuarioId: cita.usuario.id,
            mensaje: `Tu cita ha sido actualizada para el ${fechaEntrega} a las ${horaEntrega}.`,
            tipo: "Cita",
          }),
        }
      );

      if (!resNotif.ok) {
        const errorData = await resNotif.json();
        console.error("❌ Error creando notificación:", errorData);
        alert(
          `Error creando notificación: ${
            errorData.error || JSON.stringify(errorData)
          }`
        );
        return;
      }

      dispararRecarga();
      console.log("🔔 dispararRecarga desde DetalleCita ejecutado");

      const resMail = await fetch(
        `${import.meta.env.VITE_API_URL}/mail/cita/actualizada`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: cita.usuario.email,
            nombre: `${cita.usuario.nombre} ${cita.usuario.apellidos}`,
            fecha: fechaEntrega,
            hora: horaEntrega,
            provincia: admin?.provincia?.nombre || "Desconocida",
            direccion: admin?.taller?.nombre || "Dirección no disponible",
          }),
        }
      );

      if (!resMail.ok) {
        const errorData = await resMail.json();
        console.error("❌ Error enviando correo:", errorData);
        alert(
          `Error al enviar correo: ${
            errorData.error || JSON.stringify(errorData)
          }`
        );
        return;
      }

      navigate("/employees/crud/citas");
    } catch (error) {
      console.error("💥 Error inesperado:", error);
      alert("Ha ocurrido un error inesperado. Consulta la consola.");
    }
  };

  if (loading || !cita) return <p>Cargando cita...</p>;

  return (
    <div>
      <HeaderAdmin />
      <div className="formulario-reparacion">
        <form onSubmit={handleSubmit}>
          <label className="reparaciones-label">
            Nombre del cliente:
            <input
              type="text"
              className="reparacion-input"
              value={`${cita.usuario.nombre} ${cita.usuario.apellidos}`}
              readOnly
            />
          </label>

          <label className="reparaciones-label">
            Email del cliente:
            <input
              type="email"
              className="reparacion-input"
              value={cita.usuario.email}
              readOnly
            />
          </label>

          <label className="reparaciones-label">
            Matrícula del coche:
            <input
              type="text"
              className="reparacion-input"
              value={cita.usuario.coches[0].Matricula}
              readOnly
            />
          </label>

          <label className="reparaciones-label">
            Motivo de la cita:
            <input
              type="text"
              className="reparacion-input"
              value={cita.motivo}
              readOnly
            />
          </label>

          <label>
            Fecha estimada de entrega:
            <input
              type="date"
              value={fechaEntrega}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setFechaEntrega(e.target.value)}
              required
              disabled={cita.consentimientoAceptado}
            />
          </label>

          <label>
            Hora estimada de entrega:
            <select
              value={horaEntrega}
              onChange={(e) => setHoraEntrega(e.target.value)}
              required
              disabled={cita.consentimientoAceptado}
            >
              <option value="">Selecciona una hora</option>
              {horasDisponibles.map((h, i) => (
                <option key={i} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </label>

          <div className="botones-formulario">
            <button
              type="button"
              className="boton auth-buttons__enlace"
              onClick={() => navigate(-1)}
            >
              Volver
            </button>

            {!cita.consentimientoAceptado && (
              <button type="submit">Actualizar cita</button>
            )}
          </div>
        </form>

        {!cita.consentimientoAceptado && cita.estado === "Confirmar" && (
          <div className="botones-formulario">
            <button
              className="boton presupuesto-boton"
              onClick={() =>
                navigate(`/employees/presupuesto/add/${cita.usuario.id}`, {
                  state: { citaId: cita.id },
                })
              }
            >
              Añadir presupuesto
            </button>
          </div>
        )}

        {cita.consentimientoAceptado && (
          <>
            <div className="alerta__consentimiento">
              <p>
                ✅ El consentimiento del usuario ha sido firmado correctamente.
              </p>
            </div>
            <div className="botones-formulario">
              <button
                className="boton"
                onClick={() =>
                  navigate(`/employees/crud/coches/addreparacion/${cita.id}`)
                }
              >
                Añadir reparaciones
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
