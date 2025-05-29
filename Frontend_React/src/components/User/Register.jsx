import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errores, setErrores] = useState({});

  const navigate = useNavigate();

  const validarDNIConLetra = (dni) => {
    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    if (!/^\d{8}[A-Z]$/.test(dni)) return false;
    const numero = parseInt(dni.slice(0, 8), 10);
    const letra = dni[8].toUpperCase();
    return letra === letras[numero % 23];
  };

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    if (!/^[0-9]{9}$/.test(telefono)) {
      nuevosErrores.telefono = "El teléfono debe tener exactamente 9 dígitos.";
    }

    if (!validarDNIConLetra(dni)) {
      nuevosErrores.dni = "El DNI no es válido.";
    }

    if (!validarEmail(email)) {
      nuevosErrores.email = "El correo electrónico no es válido.";
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      nuevosErrores.password =
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.";
    }

    if (password !== confirmPassword) {
      nuevosErrores.confirmPassword = "Las contraseñas no coinciden.";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellidos,
          email,
          telefono,
          dni,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrores({ general: data.error || "Error al registrarse" });
        return;
      }

      setErrores({});

      try {
        await fetch(
          `${import.meta.env.VITE_API_URL}/enviar-confirmacion/${data.usuario.id}`,
          { method: "GET" }
        );
      } catch (error) {
        console.error("Error al enviar el email de confirmación:", error);
      }

      navigate("/login", {
        state: {
          registrado: true,
          mensaje: "Te hemos enviado un correo para confirmar tu cuenta.",
        },
      });
    } catch (error) {
      console.error("Error al registrarse:", error);
      setErrores({ general: "Error al conectar con el servidor" });
    }
  };

  return (
    <div className="login-background">
      <div className="login-overlay">
        <div className="login">
          <div className="login__container">
            <h2 className="login__titulo">Crear Cuenta</h2>
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
              {errores.email && (
                <p className="signup__error">{errores.email}</p>
              )}
              <input
                type="text"
                placeholder="Teléfono"
                className="login__input"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
              {errores.telefono && (
                <p className="signup__error">{errores.telefono}</p>
              )}
              <input
                type="text"
                placeholder="DNI"
                className="login__input"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
              />
              {errores.dni && <p className="signup__error">{errores.dni}</p>}

              <input
                type="password"
                placeholder="Contraseña"
                className="login__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errores.password && (
                <p className="signup__error">{errores.password}</p>
              )}

              <input
                type="password"
                placeholder="Confirmar Contraseña"
                className="login__input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {errores.confirmPassword && (
                <p className="signup__error">{errores.confirmPassword}</p>
              )}

              {errores.general && (
                <p className="signup__error">{errores.general}</p>
              )}

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
