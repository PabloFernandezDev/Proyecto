import React, { useEffect, useState } from "react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    if (!/^[0-9]{9}$/.test(telefono)) {
      nuevosErrores.telefono = "El teléfono debe tener exactamente 9 dígitos.";
    }

    if (!/^[0-9]{8}[A-Z]$/.test(dni)) {
      nuevosErrores.dni =
        "El DNI debe tener 8 números y una letra mayúscula al final.";
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
      const response = await fetch("http://127.0.0.1:8000/register", {
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
      console.log(data)
      setErrores({});

      try {
        await fetch(
          `http://127.0.0.1:8000/enviar-confirmacion/${data.usuario.id}`,
          {
            method: "GET",
          }
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
