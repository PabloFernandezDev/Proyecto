import React from 'react';
import Icon from '../assets/Icon';
import '../style.css'


export const Header = () => {
  return (
    <nav className='navbar'>
        <a href="#"><Icon icon="directions_car" size={50} color="black" className="icon" /></a>
        <a href="#">Inicio</a>
        <a href="#">Sobre Nosotros</a>
        <a href="#">Donde estamos</a>
    </nav>
  );
};