import React, { useState } from "react";
import Icon from "../../assets/Icon";
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
          <Icon
            icon="directions_car"
            size={50}
            color="white"
            className="icon"
          />
        </NavLink>

        <div className="navbar-enlaces">
          <NavLink to="/">Inicio</NavLink>
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
        </div>
        <button className="menu-toggle" onClick={toggleMenu}>
          {menuAbierto ? <IoClose /> : <GiHamburgerMenu />}
        </button>
      </nav>

      
    </>
  );
};
