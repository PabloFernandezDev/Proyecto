import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderAdmin } from "./HeaderAdmin";

export const AdminPanel = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const adminGuardado = localStorage.getItem("Admin");
    if (adminGuardado) {
      setAdmin(JSON.parse(adminGuardado));
    }
  }, []);

  if (!admin) {
    return <p>Cargando administrador...</p>;
  }

  const isAdmin = admin.rol === "ADMIN";

  return (
    <div>
      <HeaderAdmin />
      <div className="admin-panel">
        <div className="admin-buttons">
          {!isAdmin && (
            <button onClick={() => navigate("/employees/crud/users")}>
              Gestión de Usuarios
            </button>
          )}
          <button onClick={() => navigate("/employees/crud/coches")}>
            Gestión de Coches
          </button>
          {!isAdmin && (
            <>
            <button onClick={() => navigate("/employees/crud/admins")}>
                Gestión de Administradores
              </button>
              <button onClick={() => navigate("/employees/crud/mecanicos")}>
                Gestión de Mecanicos
              </button>
              <button onClick={() => navigate("/employees/crud/facturas")}>
              Gestión de Facturas
            </button>
            </>
          )}
          <button onClick={() => navigate("/employees/crud/citas/all")}>
            Gestión de Citas
          </button>
          
        </div>
      </div>
    </div>
  );
};
