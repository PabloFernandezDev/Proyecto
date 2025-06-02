import React, { useState } from "react";
import Icon from "../../assets/Icon";
import icono from "../../assets/images/iconoCarCareNow.png";
import { NavLink, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

export const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("user_id");
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    setMenuAbierto(false);
  };

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  return (
    <>
      <nav className="navbar">
        <NavLink to={isLoggedIn ? "/home" : "/"}>
          <img src={icono} className="logo" alt="CarCareNow Logo" />
        </NavLink>

        <div className="navbar-enlaces">
          <NavLink to={isLoggedIn ? "/home" : "/"}>Inicio</NavLink>
          <NavLink to="/aboutus">Sobre Nosotros</NavLink>
          <NavLink to="/where">Donde Estamos</NavLink>

          {!isLoggedIn ? (
            <>
              <NavLink to="/login" className="boton auth-buttons__enlace">
                Iniciar Sesión
              </NavLink>
              <NavLink to="/register" className="boton auth-buttons__enlace">
                Registrarse
              </NavLink>
            </>
          ) : (
            <>
              <button
                onClick={handleLogout}
                className="boton auth-buttons__enlace"
              >
                Salir
              </button>
              <NavLink to="/home/perfil">
                <FiUser size={32} className="icono-perfil" title="Perfil" />
              </NavLink>
            </>
          )}
          <div className={`mobile-menu ${menuAbierto ? "active" : ""}`}>
            {!isLoggedIn ? (
              <>
                <NavLink to="/login" onClick={() => setMenuAbierto(false)}>
                  Iniciar Sesión
                </NavLink>
                <NavLink to="/register" onClick={() => setMenuAbierto(false)}>
                  Registrarse
                </NavLink>
              </>
            ) : (
              <>
                <button onClick={handleLogout}>Salir</button>
                <NavLink
                  to="/home/perfil"
                  onClick={() => setMenuAbierto(false)}
                >
                  <FiUser size={24} /> Perfil
                </NavLink>
              </>
            )}
          </div>
        </div>
        <button className="menu-toggle" onClick={toggleMenu}>
          {menuAbierto ? <IoClose /> : <GiHamburgerMenu />}
        </button>
      </nav>
    </>
  );
};
