import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { HeaderAdmin } from "../Admin/HeaderAdmin";

export const AddReparacionCoche = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const citaId = useParams();
  const [usuario, setUsuario] = useState(null);
  const [coche, setCoche] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [horaEntrega, setHoraEntrega] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [mecanico, setMecanico] = useState("");
  const [mecanicos, setMecanicos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taller, setTaller] = useState(0);
  const [admin, setAdmin] = useState(null);
  console.log(admin);
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

  function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("Admin"));
    setAdmin(admin);
    const Taller = admin?.taller;
    setTaller(Taller);

    const cargarDatos = async () => {
      try {
        setLoading(true);

        const resCita = await fetch(
          `${import.meta.env.VITE_API_URL}/cita/${citaId.citaId}`
        );
        if (!resCita.ok) throw new Error("Error al cargar la cita");
        const cita = await resCita.json();
        console.log(cita);
        setUsuario(cita.usuario);
        setCoche(cita.usuario?.coches?.[0] || null);
        setFechaEntrega(cita.fecha.split("T")[0]);
        setHoraEntrega(cita.hora?.split("T")[1]?.slice(0, 5) || "");

        const tareasDesdeFactura = (cita.facturas?.[0]?.lineaFactura || []).map(
          (linea) => ({
            descripcion: linea.concepto,
          })
        );

        if (tareasDesdeFactura.length > 0) {
          setTareas(tareasDesdeFactura);
        } else if (cita.motivo) {
          setTareas([{ descripcion: cita.motivo }]);
        } else {
          setTareas([{ descripcion: "" }]);
        }

        const resMecanicos = await fetch(
          `${import.meta.env.VITE_API_URL}/taller/${Taller.id}/mecanicos`
        );
        if (!resMecanicos.ok) throw new Error("Error al cargar los mecánicos");
        const mecanicosData = await resMecanicos.json();
        setMecanicos(mecanicosData.mecanicos);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (citaId) cargarDatos();
  }, [citaId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tareasValidas = tareas.filter((t) => t.descripcion.trim() !== "");
    if (tareasValidas.length === 0) {
      alert("Debes añadir al menos una reparación.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reparaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cocheId: coche?.id,
          mecanicoId: mecanico,
          fechaInicio,
          fechaEntrega,
          tareas: tareasValidas,
          taller: taller.id,
        }),
      });

      if (!res.ok) throw new Error("Error al registrar la reparación.");

      const actualizarCita = await fetch(
        `${import.meta.env.VITE_API_URL}/cita/${citaId.citaId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fechaEntrega: fechaEntrega,
            horaEntrega: horaEntrega,
            estado: "Asignado Mecanico",
          }),
        }
      );

      if (!actualizarCita.ok) throw new Error("Error al actualizar la cita.");

      await fetch(`${import.meta.env.VITE_API_URL}/coche/${coche.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "Asignado" }),
      });

      await fetch(`${import.meta.env.VITE_API_URL}/notificacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: usuario.id,
          mensaje: `Su coche ha sido asignado a un mecánico para su reparación.`,
          tipo: "asignado_mecanico",
        }),
      });

      await fetch(`${import.meta.env.VITE_API_URL}/mail/cita/actualizada`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: usuario.email,
          nombre: `${usuario.nombre} ${usuario.apellidos}`,
          fecha: fechaEntrega,
          hora: horaEntrega,
          provincia: admin?.provincia?.nombre || "Desconocida",
          direccion: taller?.nombre || "Dirección no disponible",
        }),
      });

      navigate("/employees/crud/citas");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleTareaChange = (index, value) => {
    const nuevasTareas = [...tareas];
    nuevasTareas[index].descripcion = value;
    setTareas(nuevasTareas);

    if (index === tareas.length - 1 && value.trim() !== "") {
      setTareas([...nuevasTareas, { descripcion: "" }]);
    }
  };

  return (
    <div>
      <HeaderAdmin />
      <div className="formulario-reparacion">
        {loading ? (
          <p>Cargando datos del taller...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {usuario && (
              <>
                <label className="reparaciones-label">
                  Nombre del cliente:
                  <input
                    type="text"
                    className="reparacion-input"
                    value={`${usuario.nombre} ${usuario.apellidos}`}
                    readOnly
                  />
                </label>
                <label className="reparaciones-label">
                  Email del cliente:
                  <input
                    type="text"
                    className="reparacion-input"
                    value={usuario.email}
                    readOnly
                  />
                </label>
              </>
            )}

            {coche && (
              <label className="reparaciones-label">
                Matrícula del coche:
                <input
                  type="text"
                  className="reparacion-input"
                  value={coche.Matricula}
                  readOnly
                />
              </label>
            )}

            <label>
              Mecánico:
              <select
                value={mecanico}
                onChange={(e) => setMecanico(e.target.value)}
                required
              >
                <option value="">Selecciona un mecánico</option>
                {mecanicos.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.Nombre} {m.Apellidos}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Fecha estimada de entrega:
              <input
                type="date"
                value={fechaEntrega}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFechaEntrega(e.target.value)}
                required
              />
            </label>

            <label>
              Hora estimada de entrega:
              <select
                value={horaEntrega}
                onChange={(e) => setHoraEntrega(e.target.value)}
                required
              >
                <option value="">Selecciona una hora</option>
                {horasDisponibles.map((h, i) => (
                  <option key={i} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </label>

            <div className="reparaciones-lista">
              <label className="reparaciones-label">
                Reparaciones a realizar:
              </label>
              {tareas.map((tarea, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <input
                    type="text"
                    className="reparacion-input"
                    placeholder={`Descripción ${index + 1}`}
                    value={tarea.descripcion}
                    onChange={(e) => handleTareaChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="botones-formulario">
              <button
                type="button"
                className="boton auth-buttons__enlace"
                onClick={() => navigate(-1)}
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={
                  !coche ||
                  !mecanico ||
                  tareas.every((t) => t.descripcion.trim() === "")
                }
              >
                Registrar reparación
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
