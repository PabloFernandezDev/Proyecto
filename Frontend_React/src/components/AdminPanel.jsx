import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderAdmin } from "./HeaderAdmin";

export const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div>
        <HeaderAdmin/>
      <div className="admin-panel">

        <div className="admin-buttons">
          <button onClick={() => navigate("/employees/crud/users")}>
            Gestión de Usuarios
          </button>
          <button onClick={() => navigate("/employees/crud/coches")}>
            Gestión de Coches
          </button>
          <button onClick={() => navigate("/employees/crud/mecanicos")}>
            Gestión de Mecanicos
          </button>
          <button onClick={() => navigate("/employees/crud/citas")}>
            Gestión de Citas
          </button>
        </div>
      </div>
    </div>
  );
};
