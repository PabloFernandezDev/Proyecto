import React from 'react'

const admin = JSON.parse(localStorage.getItem("Admin"));
console.log(admin);
  const handleLogout = () => {
    localStorage.removeItem("Admin");
    navigate("/employees");
  };

export const HeaderAdmin = () => {
  return (
    <header className="admin-header">
          <span>Panel de Control</span>
          <span>Admin {admin.numAdmin}</span>
          <span>Taller {admin.provincia}</span>
          <button className="boton auth-buttons__enlace" onClick={handleLogout}>
            Salir
          </button>
        </header>
  )
}
