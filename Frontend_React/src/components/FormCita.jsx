import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";

export const FormCita = () => {
  const [provincia, setProvincia] = useState("");
  const [provincias, setProvincias] = useState([]);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [errorFecha, setErrorFecha] = useState("");
  const navigate = useNavigate();
  console.log(provincias);
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
    const obtenerProvincias = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/provincias`);
        if (!response.ok) throw new Error("Error al obtener las provincias");
        const data = await response.json();
        setProvincias(data);
      } catch (error) {
        console.error("Error:", error);
        alert("No se pudieron cargar las provincias.");
      }
    };

    obtenerProvincias();
  }, []);

  const handleFechaChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const day = selectedDate.getDay();
    if (day === 0 || day === 6) {
      setErrorFecha("No se puede pedir cita en fin de semana.");
      setFecha("");
    } else {
      setErrorFecha("");
      setFecha(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("user_id");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/citas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provincia, fecha, hora, motivo, userId }),
      });

      if (response.ok) {
        const provinciaSeleccionada = provincias.find(
          (p) => p.nombre === provincia
        );
        let direccion = "Dirección no disponible";

        if (provinciaSeleccionada && provinciaSeleccionada.tallers.length > 0) {
          direccion = provinciaSeleccionada.tallers[0].direccion;
        }

        await fetch(`${import.meta.env.VITE_API_URL}/mail/cita`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provincia, fecha, hora, userId, direccion }),
        });

        navigate("/home", {
          state: {
            citaSolicitada: true,
            citaMensaje: `📅 Cita solicitada para el ${fecha} a las ${hora}`,
          },
        });
      } else {
        console.error("No se pudo crear la cita");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="formulario-cita__container">
        <h2>Pedir Cita</h2>
        <form onSubmit={handleSubmit}>
          <label>Provincia:</label>
          <select
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            required
          >
            <option value="">Selecciona una provincia</option>
            {provincias.map((prov) => (
              <option key={prov.id} value={prov.nombre}>
                {prov.nombre}
              </option>
            ))}
          </select>

          <label>Fecha:</label>
          <input
            type="date"
            value={fecha}
            onChange={handleFechaChange}
            min={new Date().toISOString().split("T")[0]}
            required
          />
          {errorFecha && <p style={{ color: "red" }}>{errorFecha}</p>}

          <label>Hora:</label>
          <select
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
          >
            <option value="">Selecciona una hora</option>
            {horasDisponibles.map((h, i) => (
              <option key={i} value={h}>
                {h}
              </option>
            ))}
          </select>

          <label>Motivo de la cita:</label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Describe el motivo de la cita..."
            required
          />

          <button type="submit">Enviar Cita</button>
        </form>
      </div>
    </div>
  );
};
