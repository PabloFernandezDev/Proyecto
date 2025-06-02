import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "../Diseño/Header";
import { FiMessageSquare, FiX } from "react-icons/fi";
import { MapaTalleres } from "./MapaTalleres";
import { GifAnimacion } from "./GifAnimacion";
import { useNotificacionesStore } from "../../store/useNotificacionesStore";

export const DashBoard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { notificaciones, setNotificaciones } = useNotificacionesStore();

  const [usuarioTieneCoche, setUsuarioTieneCoche] = useState(false);
  const [ubicacion, setUbicacion] = useState(null);
  const [facturas, setFacturas] = useState([]);
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [imagenCoche, setImagenCoche] = useState(null);
  const [tallerId, setTallerId] = useState(null);
  const [data, setData] = useState([]);
  const [estadoVehiculo, setEstadoVehiculo] = useState("");
  const [cocheReparado, setCocheReparado] = useState(null);
  const mensajeReparadoMostradoRef = useRef(false);

  const handleVerFacturas = () => navigate("/home/facturas");
  const handleAddCar = () => navigate("/home/addcoche");
  const marcarComoLeido = async (id) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/notificaciones/${id}/leido`,
        {
          method: "PATCH",
        }
      );
      setNotificaciones(
        notificaciones.map((n) => (n.id === id ? { ...n, leido: true } : n))
      );
    } catch (error) {
      console.error("Error marcando como leído:", error);
    }
  };

  const contarNoLeidas = () => notificaciones.filter((n) => !n.leido).length;

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    const cargarDatos = async () => {
      try {
        const resCoche = await fetch(
          `${import.meta.env.VITE_API_URL}/user/${userId}/coche`
        );
        if (!resCoche.ok) throw new Error("Error al cargar coche");
        const data = await resCoche.json();
        setData(data);
        setUsuarioTieneCoche(true);
        setImagenCoche(data.imagen);
        if (data.taller?.id) setTallerId(data.taller.id);
        setFacturas(data.usuario.facturas);

        const resNoti = await fetch(
          `${import.meta.env.VITE_API_URL}/user/${userId}/notificaciones`
        );
        const notiData = await resNoti.json();
        setNotificaciones(notiData);
      } catch (err) {
        console.error("Error cargando datos periódicamente:", err);
        setUsuarioTieneCoche(false);
      }
    };

    cargarDatos();

    const intervalo = setInterval(cargarDatos, 5000);

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
    const intEstado = setInterval(revisarEstado, 5000);

    return () => {
      clearInterval(intervalo);
      clearInterval(intEstado);
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

        <div className="dashboard-full__card abajo">
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
            {!data.taller && !data.estado ? (
              "Tu coche está perfectamente"
            ) : data.taller && data.estado === "Revisión" ? (
              "Su coche está siendo revisado. Se le notificará el presupuesto lo antes posible."
            ) : data.taller && data.estado === "Asignado" ? (
              "Le he asignado un mecánico a su coche. Se le notificará cuando el mécanico comience a reparar su coche."
            ): data.taller && data.estado === "Reparando" ? (
              <GifAnimacion />
            ) : data.taller && data.estado === "Listo" ? (
              "✅ Su coche ha sido reparado. Puede pasar a recogerlo."
            ) : null}
          </p>
        </div>
      </div>

      {!mostrarPanel && (
        <button className="chat-button" onClick={() => setMostrarPanel(true)}>
          <FiMessageSquare size={24} />
          {contarNoLeidas() > 0 && (
            <span className="chat-button__badge">
              {contarNoLeidas() > 9 ? "9+" : contarNoLeidas()}
            </span>
          )}
        </button>
      )}

      <div className={`chat-panel ${mostrarPanel ? "slide-in" : "slide-out"}`}>
        <div className="chat-panel__header">
          <h4>Notificaciones</h4>
          <button
            className="chat-panel__close"
            onClick={() => setMostrarPanel(false)}
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="chat-panel__messages">
          {Array.isArray(notificaciones) &&
            notificaciones
              .slice()
              .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
              .map((noti, index) => (
                <div
                  key={index}
                  className={`chat-panel__mensaje ${
                    noti.leido ? "leido" : "noleido"
                  }`}
                >
                  <p>{noti.mensaje}</p>
                  <small>{new Date(noti.fecha).toLocaleString()}</small>
                  {!noti.leido && (
                    <button onClick={() => marcarComoLeido(noti.id)}>
                      Marcar como leído
                    </button>
                  )}
                </div>
              ))}
        </div>
        <div className="chat-panel__input">
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
