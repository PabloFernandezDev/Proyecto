import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginMecanico = () => {
  const [numEmp, setNumEmp] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/mecanico/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ numEmp, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("Mecanico", numEmp);
        navigate("/employees/mecanic/panel");
      } else {
        alert("Credenciales incorrectas o no eres mecánico.");
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="login-admin-background">
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <h2>Login de Mecánico</h2>
          <input
            type="number"
            placeholder="Número de empleado"
            value={numEmp}
            onChange={(e) => setNumEmp(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
};
