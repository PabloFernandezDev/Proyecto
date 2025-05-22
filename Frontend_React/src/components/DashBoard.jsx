import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { FiMessageSquare, FiX } from "react-icons/fi";
import { MapaTalleres } from "./MapaTalleres";
import { GifAnimacion } from "./GifAnimacion";

export const DashBoard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [usuarioTieneCoche, setUsuarioTieneCoche] = useState(false);
  const [ubicacion, setUbicacion] = useState(null);
  const [facturas, setFacturas] = useState([]);
  const [mostrarChat, setMostrarChat] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [imagenCoche, setImagenCoche] = useState(null);
  const [tallerId, setTallerId] = useState(null);
  const [data, setData] = useState([]);
  const [estadoVehiculo, setEstadoVehiculo] = useState("");
  const [cocheReparado, setCocheReparado] = useState(null);
  const mensajeReparadoMostradoRef = useRef(false);

  const handleVerFacturas = () => navigate("/home/facturas");
  const handleAddCar = () => navigate("/home/addcoche");
  const enviarMensaje = () => {
    if (mensaje.trim() !== "") {
      setMensajes([...mensajes, { texto: mensaje, propio: true }]);
      setMensaje("");
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    let eventSource = null;

    if (userId) {
      fetch(`http://127.0.0.1:8000/user/${userId}/coche`)
        .then((res) => {
          if (!res.ok) throw new Error("Sin coche");
          return res.json();
        })
        .then((data) => {
          console.log(data);
          setData(data);
          setUsuarioTieneCoche(true);
          setImagenCoche(data.imagen);
          if (data.taller && data.taller.id) {
            setTallerId(data.taller.id);
          }
          setFacturas(data.usuario.facturas);
        })
        .catch(() => setUsuarioTieneCoche(false));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUbicacion({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error("Error obteniendo ubicación:", error),
      { enableHighAccuracy: true }
    );

    if (location.state?.cocheAñadido) {
      setMostrarAlerta(true);
      window.history.replaceState({}, document.title);
    }

    if (location.state?.citaSolicitada && location.state?.citaMensaje) {
      setMensajes((prev) => [
        ...prev,
        { texto: location.state.citaMensaje, propio: true },
        {
          texto: "✅ Tu cita ha sido registrada. Nos pondremos en contacto.",
          propio: false,
        },
      ]);
      setMostrarChat(true);
      window.history.replaceState({}, document.title);
    }

    const revisarEstado = () => {
      const estado = localStorage.getItem("estadoVehiculo");
      const reparado = localStorage.getItem("CocheReparado");

      if (estado) setEstadoVehiculo(estado);
      if (reparado) setCocheReparado(reparado);

      if (reparado && !mensajeReparadoMostradoRef.current) {
        mensajeReparadoMostradoRef.current = true;

        setTimeout(() => {
          localStorage.removeItem("CocheReparado");
          window.location.reload(); 
        }, 3000);
      }
    };

    revisarEstado();
    const intervalo = setInterval(revisarEstado, 5000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(intervalo);
    };
  }, []);

  return (
    <div className="dashboard-full">
      <Header />
      <div className="dashboard-full__grid">
        <div className="dashboard-full__card">
          <h3>Ubicación</h3>
          <MapaTalleres />
        </div>
        <div className="dashboard-full__card dashboard-full__card--alto">
          <h3>Mi Vehículo</h3>
          {usuarioTieneCoche ? (
            <>
              <img
                src={`http://127.0.0.1:8000/uploads/${imagenCoche}`}
                alt="Tu coche"
                className="dashboard-full__car-img"
              />
              <button
                className="boton dashboard__boton-detalles"
                onClick={() => navigate("/home/coche/details")}
              >
                Ver Detalles
              </button>
            </>
          ) : (
            <div className="dashboard-full__placeholder">
              <p>Añade tu coche</p>
              <button onClick={handleAddCar}>Registrar Coche</button>
            </div>
          )}
        </div>

        <div className="dashboard-full__card">
          <h3>Facturas recientes</h3>
          {facturas.length > 0 ? (
            <button onClick={handleVerFacturas}>Ver todas las facturas</button>
          ) : (
            <p>No tienes facturas</p>
          )}
        </div>

        <div className="dashboard-full__card">
          <h3>Estado del Vehículo</h3>
          <p>
            {estadoVehiculo && !cocheReparado ? (
              <GifAnimacion />
            ) : tallerId && !cocheReparado ? (
              "Su coche se encuentra actualmente en el taller"
            ) : cocheReparado ? (
              "✅ Reparación finalizada. Tu coche está listo para recoger."
            ) : (
              "Tu coche está perfectamente"
            )}
          </p>
        </div>
      </div>

      {!mostrarChat && (
        <button className="chat-button" onClick={() => setMostrarChat(true)}>
          <FiMessageSquare size={24} />
        </button>
      )}

      <div className={`chat-panel ${mostrarChat ? "slide-in" : "slide-out"}`}>
        <div className="chat-panel__header">
          <h4>Chat del Taller</h4>
          <button
            className="chat-panel__close"
            onClick={() => setMostrarChat(false)}
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="chat-panel__messages">
          {mensajes.map((msg, index) => (
            <div
              key={index}
              className={`chat-panel__mensaje ${
                msg.propio ? "propio" : "otro"
              }`}
            >
              {msg.texto}
            </div>
          ))}
        </div>
        <div className="chat-panel__input">
          <input
            type="text"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe un mensaje..."
          />
          <button onClick={enviarMensaje}>Enviar</button>
          <button
            onClick={() => navigate("/home/addcita")}
            className="chat-panel__btn-cita"
          >
            Pedir Cita
          </button>
        </div>
      </div>

      {mostrarAlerta && (
        <div className="dashboard__alerta">
          <span>¡Coche añadido correctamente!</span>
          <button
            className="dashboard__alerta-cerrar"
            onClick={() => setMostrarAlerta(false)}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
};
