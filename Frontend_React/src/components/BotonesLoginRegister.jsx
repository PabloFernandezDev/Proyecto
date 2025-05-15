import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../assets/Icon';

export const BotonesLoginRegister = () => {
  const navigate = useNavigate();

  return (
    <div className="botones-login">
      <div className="botones-login__card">
        <div className="botones-login__contenido">
          <Icon icon="login" size={40} color="white" />
          <h3>Iniciar Sesión</h3>
          <p>Accede a tu cuenta para gestionar tus vehículos y servicios.</p>
        </div>
        <button className="botones-login__boton" onClick={() => navigate('/login')}>
          Entrar
        </button>
      </div>

      <div className="botones-login__card">
        <div className="botones-login__contenido">
          <Icon icon="person_add" size={40} color="white" />
          <h3>Registrarse</h3>
          <p>Crea una cuenta nueva para llevar el control completo de tu vehículo.</p>
        </div>
        <button className="botones-login__boton" onClick={() => navigate('/register')}>
          Crear cuenta
        </button>
      </div>
    </div>
  );
};
