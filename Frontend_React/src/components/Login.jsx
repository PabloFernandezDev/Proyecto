import React, { useState } from 'react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
    } catch (error) {
      console.error('Error al hacer login:', error);
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <h2 className="login__titulo">Iniciar Sesión</h2>
        <form className="login__formulario" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo Electrónico"
            className="login__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="login__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="boton login__boton">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};
