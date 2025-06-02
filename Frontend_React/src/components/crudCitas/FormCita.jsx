import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../Diseño/Header";

export const FormCita = () => {
  const [provincia, setProvincia] = useState("");
  const [provincias, setProvincias] = useState([]);
  const [talleresDisponibles, setTalleresDisponibles] = useState([]);
  const [tallerSeleccionado, setTallerSeleccionado] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [errorFecha, setErrorFecha] = useState("");
  const navigate = useNavigate();

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
    fetch(`${import.meta.env.VITE_API_URL}/provincias`)
      .then((res) => res.json())
      .then((data) => setProvincias(data))
      .catch((error) => {
        console.error("Error al cargar provincias:", error);
        alert("No se pudieron cargar las provincias.");
      });
  }, []);

  const handleProvinciaChange = (e) => {
    const selected = e.target.value;
    setProvincia(selected);
    const provinciaData = provincias.find((p) => p.nombre === selected);
    const talleres = provinciaData?.tallers || [];
    setTalleresDisponibles(talleres);
    setTallerSeleccionado("");
  };

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cita`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provincia,
          fecha,
          hora,
          motivo,
          userId,
        }),
      });

      if (!response.ok) {
        console.error("No se pudo crear la cita");
        return;
      }

      const taller = talleresDisponibles.find(
        (t) => t.id === parseInt(tallerSeleccionado)
      );

      const direccion = taller?.direccion || "No disponible";

      const emailRes = await fetch(
        `${import.meta.env.VITE_API_URL}/mail/cita`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fecha,
            hora,
            userId,
            direccion,
            provincia,
          }),
        }
      );

      if (!emailRes.ok) {
        console.error("No se pudo enviar el email");
        return;
      }

      const notiRes = await fetch(
        `${import.meta.env.VITE_API_URL}/notificacion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuarioId: userId,
            mensaje: `Tu cita ha sido solicitada para el ${fecha} a las ${hora}.`,
            tipo: "Cita",
          }),
        }
      );

      if (!notiRes.ok) {
        console.error("No se pudo crear la notificación");
        return;
      }
      localStorage.setItem("nuevaNotificacion", "true");

      navigate("/home", {
        state: {
          citaSolicitada: true,
        },
      });
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
          <select value={provincia} onChange={handleProvinciaChange} required>
            <option value="">Selecciona una provincia</option>
            {provincias.map((prov) => (
              <option key={prov.id} value={prov.nombre}>
                {prov.nombre}
              </option>
            ))}
          </select>

          {provincia && (
            <>
              <label>Dirección del taller:</label>
              {talleresDisponibles.length > 0 ? (
                <select
                  value={tallerSeleccionado}
                  onChange={(e) => setTallerSeleccionado(e.target.value)}
                  required
                >
                  <option value="">Selecciona una dirección</option>
                  {talleresDisponibles.map((taller) => (
                    <option key={taller.id} value={taller.id}>
                      {taller.direccion}
                    </option>
                  ))}
                </select>
              ) : (
                <p style={{ color: "red" }}>
                  No hay talleres disponibles en esta provincia.
                </p>
              )}
            </>
          )}

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

          <button className="boton login__boton" type="submit">Enviar Cita</button>
        </form>
      </div>
    </div>
  );
};
