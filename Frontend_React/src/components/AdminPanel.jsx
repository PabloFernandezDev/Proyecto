import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminPanel = () => {
  const navigate = useNavigate();

  const admin = localStorage.getItem("Admin");

  const handleLogout = () => {
    localStorage.removeItem("Admin");
    navigate("/employees");
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <span>Panel de Control</span>
        <span>Admin {admin}</span>
        <button className="boton auth-buttons__enlace" onClick={handleLogout}>
          Salir
        </button>
      </header>

      <div className="admin-buttons">
        <button onClick={() => navigate("/admin/usuarios")}>
          Gestión de Usuarios
        </button>
        <button onClick={() => navigate("/admin/coches")}>
          Gestión de Coches
        </button>
        <button onClick={() => navigate("/admin/empleados")}>
          Gestión de Mecanicos
        </button>
        <button onClick={() => navigate("/admin/citas")}>
          Gestión de Citas
        </button>
      </div>
    </div>
  );
};
