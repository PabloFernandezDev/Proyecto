import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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

      if (response.ok) {
        console.log('Login exitoso:', data);
        navigate('/home');
      } else {
        alert(data.detail || 'Error al iniciar sesión.');
      }
    } catch (error) {
      console.error('Error al hacer login:', error);
      alert('Ocurrió un error en la conexión.');
    }
  };

  return (
    <div className="login-background">
      <div className="login-overlay">
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
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                className="login__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="boton login__boton">
                Iniciar Sesión
              </button>
              <p className="login__registro">
                ¿No tienes cuenta? <a href="/register">Regístrate</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};