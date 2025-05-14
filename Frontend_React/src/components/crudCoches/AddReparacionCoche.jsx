import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderAdmin } from "../HeaderAdmin";

export const AddReparacionCoche = () => {
  const [coches, setCoches] = useState([]);
  const [cocheSeleccionado, setCocheSeleccionado] = useState("");
  const [estado, setEstado] = useState("En revisión");
  const [fechaInicio, setFechaInicio] = useState("");
  const [mecanico, setMecanico] = useState("");
  const [mecanicos, setMecanicos] = useState([]);
  const [tareas, setTareas] = useState([""]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();




  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("Admin"));
    const idTaller = admin?.taller;

    const hoy = new Date().toISOString().split("T")[0];
    setFechaInicio(hoy);

    const cargarDatos = async () => {
      
      try {
        setLoading(true);

        const resMecanicos = await fetch(
          `http://127.0.0.1:8000/taller/${idTaller}/mecanicos`
        );
        const resCoches = await fetch(
          `http://127.0.0.1:8000/taller/${idTaller}/cochesdisponibles`
        );

        if (!resMecanicos.ok || !resCoches.ok) {
          throw new Error("Error al cargar los datos del taller");
        }

        const mecanicosData = await resMecanicos.json();
        const cochesData = await resCoches.json();

        setMecanicos(mecanicosData.mecanicos);
        setCoches(cochesData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        alert(error.message || "Error al cargar los datos del taller");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tareasFiltradas = tareas.filter((t) => t.trim() !== "");

    if (tareasFiltradas.length === 0) {
      alert("Debes añadir al menos una reparación a realizar.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/reparaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cocheId: cocheSeleccionado,
          mecanicoId: mecanico,
          estado,
          fechaInicio,
          tareas: tareasFiltradas,
        }),
      });

      if (response.ok) {
        navigate('/employees/crud/coches/', { state: { operacion: true } })
      } else {
        alert("Error al registrar la reparación");
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  };

  const handleTareaChange = (index, value) => {
    const nuevasTareas = [...tareas];
    nuevasTareas[index] = value;
    setTareas(nuevasTareas);

    if (index === tareas.length - 1 && value.trim() !== "") {
      setTareas([...nuevasTareas, ""]);
    }
  };

  return (
    <div>
      <HeaderAdmin/>

      <div className="formulario-reparacion">
        {loading ? (
          <p>Cargando datos del taller...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Coche:
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
              Estado inicial:
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                required
              >
                <option value="Sin Empezar">Sin Empezar</option>
              </select>
            </label>

            <label>
              Fecha de entrada:
              <input
                type="date"
                value={fechaInicio}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFechaInicio(e.target.value)}
                required
              />
            </label>

            <div className="reparaciones-lista">
              <label className="reparaciones-label">
                Reparaciones a realizar:
              </label>
              {tareas.map((tarea, index) => (
                <input
                  key={index}
                  type="text"
                  className="reparacion-input"
                  value={tarea}
                  placeholder={`Reparación ${index + 1}`}
                  onChange={(e) => handleTareaChange(index, e.target.value)}
                />
              ))}
            </div>
              <button className="boton auth-buttons__enlace">
            Volver
          </button>
            <button
              type="submit"
              disabled={
                !coches.length ||
                !mecanicos.length ||
                tareas.every((t) => t.trim() === "")
              }
            >
              Registrar reparación
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
