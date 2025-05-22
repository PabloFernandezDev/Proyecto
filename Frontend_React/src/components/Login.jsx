import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login exitoso:", data);

        localStorage.setItem("user_email", data.usuario.email);
        localStorage.setItem("user_id", data.usuario.id);

        navigate("/home");
      } else {
        console.log(data.error);
        setMensajeError(data.error || "Error al iniciar sesión.");
        return;
      }
    } catch (error) {
      console.error("Error al hacer login:", error);
      alert("Ocurrió un error en la conexión.");
    }
  };

  useEffect(() => {
    if (location.state?.registrado) {
      setMostrarAlerta(true);
    }
  }, [location.state]);

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
              {mensajeError && <p className="login__error">{mensajeError}</p>}

              {mostrarAlerta && (
                <div className="alerta__login">
                  <span>¡Registro exitoso!</span>
                  <span>
                    Primero tienes que confirmar tu cuenta. Revisa tu bandeja de
                    entrada para confirmar tu cuenta
                  </span>
                  <button
                    className="alerta__login-cerrar"
                    onClick={() => setMostrarAlerta(false)}
                  >
                    X
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
