import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginAdmin = () => {
  const [numEmp, setNumEmp] = useState(0);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ numEmp: numEmp, password }),
      });
      if (!numEmp || isNaN(numEmp) || !password) {
        alert("Rellena ambos campos correctamente");
        return;
      }

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        navigate("/employees/admin/panel");
        localStorage.setItem(
          "Admin",
          JSON.stringify({
            idAdmin: data.id,
            numAdmin: data.numEmp,
            provincia: data.provincia,
            taller: data.taller
          })
        );
      } else {
        alert("Credenciales incorrectas o no eres administrador.");
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="login-admin-background">
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <h2>Administrador</h2>
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
