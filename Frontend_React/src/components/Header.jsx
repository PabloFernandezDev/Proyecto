import React from 'react';
import Icon from '../assets/Icon';
import '../style.css'
import { NavLink } from 'react-router-dom'


export const Header = () => {
  return (
    <nav className='navbar'>
        <a href="#"><Icon icon="directions_car" size={50} color="black" className="icon" /></a>
        <a href="#">Inicio</a>
        <a href="#">Sobre Nosotros</a>
        <a href="#">Donde estamos</a>
        <NavLink to='/login' className="boton auth-buttons__enlace">Iniciar Sesión</NavLink>
        <NavLink to='/register' className="boton auth-buttons__enlace">Registrarse</NavLink>
    </nav>
  );
};