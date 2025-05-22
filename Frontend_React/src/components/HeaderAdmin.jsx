import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const HeaderAdmin = () => {
  const [admin, setAdmin] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  console.log(admin)
  const handleLogout = () => {
    localStorage.removeItem("Admin");
    navigate("/employees");
  };

  useEffect(() => {
    const cargarAdmin = async () => {
      try {
        const adminGuardado = localStorage.getItem("Admin");
        if (adminGuardado) {
          const adminParseado = JSON.parse(adminGuardado);
          setAdmin(adminParseado);
        }
      } catch (error) {
        console.error("Error al cargar admin:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarAdmin();
  }, []);

  if (cargando) {
    return (
      <header className="admin-header">
        <span>Cargando información del administrador...</span>
      </header>
    );
  }

  if (!admin) {
    return (
      <header className="admin-header">
        <span>No se encontró el administrador.</span>
        <button className="boton auth-buttons__enlace" onClick={handleLogout}>
          Volver
        </button>
      </header>
    );
  }

  return (
    <header className="admin-header">
      <span>Panel de Control</span>
      <span>Admin {admin.numAdmin}</span>
      <span>Taller {admin.provincia.nombre}</span>
      <button className="boton auth-buttons__enlace" onClick={handleLogout}>
        Salir
      </button>
    </header>
  );
};
