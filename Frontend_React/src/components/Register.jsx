import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, apellidos, email, telefono, dni, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al registrarse');
        return;
      }

      setError('');
      navigate('/login', { state: { registrado: true } });
    } catch (error) {
      console.error('Error al registrarse:', error);
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="login-background">
      <div className="login-overlay">
        <div className="login">
          <div className="login__container">
            <h2 className="login__titulo">Crear Cuenta</h2>
            {error && <p className="signup__error">{error}</p>}
            <form className="login__formulario" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nombre"
                className="login__input"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Apellidos"
                className="login__input"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Correo Electrónico"
                className="login__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Teléfono"
                className="login__input"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="DNI"
                className="login__input"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
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
              <input
                type="password"
                placeholder="Confirmar Contraseña"
                className="login__input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit" className="boton login__boton">
                Registrarse
              </button>
              <p className="login__registro">
                ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
