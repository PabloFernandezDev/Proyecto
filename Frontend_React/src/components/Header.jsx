import React from 'react';
import Icon from '../assets/Icon';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import '../style.css';
import { FiUser } from 'react-icons/fi';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('user_id');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const inicioPath = location.pathname === '/home' ? '/home' : '/';

  return (
    <nav className='navbar'>
      <NavLink to={inicioPath}><Icon icon="directions_car" size={50} color="black" className="icon" /></NavLink>
      <NavLink to={inicioPath}>Inicio</NavLink>
      <NavLink to='/aboutus'>Sobre Nosotros</NavLink>
      <NavLink to='/where'>Donde Estamos</NavLink>

      {!isLoggedIn ? (
        <>
          <NavLink to='/login' className="boton auth-buttons__enlace">Iniciar Sesión</NavLink>
          <NavLink to='/register' className="boton auth-buttons__enlace">Registrarse</NavLink>
        </>
      ) : (
        <>
          <button onClick={handleLogout} className="boton auth-buttons__enlace">Salir</button>
          <NavLink to='/home/perfil'><FiUser size={32} className='icono-perfil' title="Perfil" /></NavLink>
        </>
      )}
    </nav>
  );
};
