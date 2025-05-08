import React, { useState } from 'react';
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

  const navigate = useNavigate(); // Hook para redireccionar

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
      navigate('/login'); // Redirección tras registro exitoso
    } catch (error) {
      console.error('Error al registrarse:', error);
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="signup">
      <div className="signup__container">
        <h2 className="signup__titulo">Crear Cuenta</h2>
        {error && <p className="signup__error">{error}</p>}
        <form className="signup__formulario" onSubmit={handleSubmit}>
          {/* inputs... */}
          <input type="text" placeholder="Nombre" className="signup__input" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <input type="text" placeholder="Apellidos" className="signup__input" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
          <input type="email" placeholder="Correo Electrónico" className="signup__input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="text" placeholder="Telefono" className="signup__input" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
          <input type="text" placeholder="Dni" className="signup__input" value={dni} onChange={(e) => setDni(e.target.value)} required />
          <input type="password" placeholder="Contraseña" className="signup__input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirmar Contraseña" className="signup__input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <button type="submit" className="boton signup__boton">Registrarse</button>
        </form>
      </div>
    </div>
  );
};
