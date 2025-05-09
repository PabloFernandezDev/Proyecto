import React from 'react';
import Icon from '../assets/Icon';
import '../style.css'
import { NavLink } from 'react-router-dom'


export const Header = () => {
  return (
    <nav className='navbar'>
        <NavLink to='/'><Icon icon="directions_car" size={50} color="black" className="icon" /></NavLink>
        <NavLink to='/'>Inicio</NavLink>
        <NavLink to='/aboutus' >Sobre Nosotros</NavLink>
        <NavLink to='/where' >Donde Estamos</NavLink>
        <NavLink to='/login' className="boton auth-buttons__enlace">Iniciar Sesión</NavLink>
        <NavLink to='/register' className="boton auth-buttons__enlace">Registrarse</NavLink>
    </nav>
  );
};