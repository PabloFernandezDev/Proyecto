import React from "react";
import { useNavigate } from "react-router-dom";

export const Empleados = () => {
  const navigate = useNavigate();

  return (
    <div className="login-empleados-background">
      <div className="login-empleados-card">
        <h2>Iniciar sesión Administrador</h2>
        <div className="botones-rol">
          <button onClick={() => navigate("/employees/admin")}>
            Administrador
          </button>
          <button onClick={() => navigate("/employees/admin")}>
            Super Administrador
          </button>
        </div>
      </div>
    </div>
  );
};
