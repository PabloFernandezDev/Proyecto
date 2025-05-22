import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HeaderAdmin } from "../HeaderAdmin";

export const AddReparacionCoche = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const cocheInicial = location.state?.coche || null;
  const motivoCita = location.state?.motivo || "";
  const usuarioInicial = location.state?.usuario || null;
  const citaId = location.state?.citaId || null;
  const fechaInicio = location.state?.fechaInicio || null;
  const [coches, setCoches] = useState([]);
  const [cocheSeleccionado, setCocheSeleccionado] = useState(
    cocheInicial?.id || ""
  );
  const [horaEntrega, setHoraEntrega] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [mecanico, setMecanico] = useState("");
  const [mecanicos, setMecanicos] = useState([]);
  const [tareas, setTareas] = useState(
    motivoCita
      ? [
          { descripcion: motivoCita, precio: "" },
          { descripcion: "", precio: "" },
        ]
      : [{ descripcion: "", precio: "" }]
  );

  console.log(usuarioInicial)
  const [loading, setLoading] = useState(true);
  const [taller, setTaller] = useState(0);
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
    const admin = JSON.parse(localStorage.getItem("Admin"));
    const idTaller = admin?.taller.id;
    setTaller(idTaller);

    const hoy = new Date().toISOString().split("T")[0];
    setFechaEntrega(hoy);

    const cargarDatos = async () => {
      try {
        setLoading(true);

        const resMecanicos = await fetch(
          `${import.meta.env.VITE_API_URL}/taller/${idTaller}/mecanicos`
        );

        if (!resMecanicos.ok) {
          throw new Error("Error al cargar los mecanicos");
        }
        const mecanicosData = await resMecanicos.json();

        setMecanicos(mecanicosData.mecanicos);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tareasFiltradas = tareas.filter(
      (t) => t.descripcion.trim() !== "" && !isNaN(parseFloat(t.precio))
    );

    if (tareasFiltradas.length === 0) {
      alert("Debes añadir al menos una reparación a realizar.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reparaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cocheId: cocheInicial?.id,
          mecanicoId: mecanico,
          fechaInicio,
          fechaEntrega,
          tareas: tareasFiltradas,
          taller: taller,
        }),
      });

      if (response.ok && citaId) {
        const actualizarCita = await fetch(
          `${import.meta.env.VITE_API_URL}/cita/${citaId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fechaEntrega: fechaEntrega,
              horaEntrega: horaEntrega,
            }),
          }
        );
        if (!actualizarCita.ok) {
          alert(
            "La reparación se registró, pero no se pudo actualizar la cita."
          );
        } else {
          await enviarCorreoRecogida();
          navigate("/employees/crud/citas");
        }
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  };

  const handleTareaChange = (index, field, value) => {
    const nuevasTareas = [...tareas];
    nuevasTareas[index][field] = value;
    setTareas(nuevasTareas);

    if (
      field === "descripcion" &&
      index === tareas.length - 1 &&
      value.trim() !== ""
    ) {
      setTareas([...nuevasTareas, { descripcion: "", precio: "" }]);
    }
  };

  const enviarCorreoRecogida = async () => {
    const admin = JSON.parse(localStorage.getItem("Admin"));
    const direccion =
      admin?.taller?.nombre;
    await fetch(`${import.meta.env.VITE_API_URL}/mail/cita/recoger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: usuarioInicial?.id,
        fecha: fechaEntrega,
        direccion: direccion,
      }),
    });
  };

  return (
    <div>
      <HeaderAdmin />
      <div className="formulario-reparacion">
        {loading ? (
          <p>Cargando datos del taller...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {usuarioInicial?.id && (
              <>
                <label className="reparaciones-label">
                  Nombre del cliente:
                  <input
                    type="text"
                    className="reparacion-input"
                    value={`${usuarioInicial.nombre}  ${usuarioInicial.apellidos}`}
                    readOnly
                  />
                </label>
                <label className="reparaciones-label">
                  Email del cliente:
                  <input
                    type="text"
                    className="reparacion-input"
                    value={usuarioInicial.email}
                    readOnly
                  />
                </label>
              </>
            )}

            <label className="reparaciones-label">
              Matrícula del coche:
              {cocheInicial ? (
                <input
                  type="text"
                  className="reparacion-input"
                  value={`${cocheInicial.Matricula}`}
                  readOnly
                />
              ) : (
                <select
                  value={cocheSeleccionado}
                  onChange={(e) => setCocheSeleccionado(e.target.value)}
                  required
                >
                  <option value="">Selecciona un coche</option>
                  {coches.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.Matricula} - {c.usuario?.nombre} {c.usuario?.apellidos}
                    </option>
                  ))}
                </select>
              )}
            </label>

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
                <div
                  key={index}
                  style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
                >
                  <input
                    type="text"
                    className="reparacion-input"
                    placeholder={`Descripción ${index + 1}`}
                    value={tarea.descripcion}
                    onChange={(e) =>
                      handleTareaChange(index, "descripcion", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    min="0"
                    className="reparacion-input"
                    placeholder="€"
                    value={tarea.precio}
                    onChange={(e) =>
                      handleTareaChange(index, "precio", e.target.value)
                    }
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
                  (!cocheInicial && !cocheSeleccionado) ||
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
