import React from "react";
import { useNavigate } from "react-router-dom";

export const Confirmado = () => {
  const navigate = useNavigate();

  return (
    <div className="confirmacion__fondo">
      <div className="confirmacion__contenedor">
        <h2 className="confirmacion__titulo">¡Cuenta confirmada con éxito!</h2>
        <p className="confirmacion__mensaje">
          Ya puedes iniciar sesión con tu cuenta.
        </p>
        <button
          className="confirmacion__boton"
          onClick={() => navigate("/login")}
        >
          Ir al Login
        </button>
      </div>
    </div>
  );
};
