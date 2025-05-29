import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderAdmin } from "../Admin/HeaderAdmin";

export const AddMecanico = () => {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [numEmp, setNumEmp] = useState("");
  const [password, setPassword] = useState("");
  const [adminId, setAdminId] = useState("");
  const [admins, setAdmins] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();


  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/provincias`)
      .then((res) => res.json())
      .then((data) => setProvincias(data))
      .catch((err) => {
        console.error("Error al cargar provincias:", err);
        alert("No se pudieron cargar las provincias.");
      });
  }, []);


  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admins`)
      .then((res) => res.json())
      .then((data) => setAdmins(data))
      .catch((err) => {
        console.error("Error al cargar administradores:", err);
        alert("No se pudieron cargar los administradores.");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !apellidos || !numEmp || !password || !adminId) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const body = {
      nombre,
      apellidos,
      numEmp: parseInt(numEmp),
      password,
      adminId: parseInt(adminId),
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/mecanicos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Error desconocido");
      }

      navigate("/employees/crud/mecanicos");
    } catch (err) {
      console.error("Error al crear mecánico:", err);
      setError(err.message);
    }
  };

  const adminsFiltrados = admins.filter(
    (admin) =>
      admin.rol === "ADMIN" &&
      admin.taller?.provincia?.nombre === provinciaSeleccionada
  );

  return (
    <div>
      <HeaderAdmin />
      <div className="form-container">
        <h2>Añadir Mecánico</h2>
        <form onSubmit={handleSubmit} className="formulario">
          {error && <p className="mensaje-error">{error}</p>}

          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="text"
            placeholder="Apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
          />
          <input
            type="number"
            placeholder="Número de Empleado"
            value={numEmp}
            onChange={(e) => setNumEmp(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            value={provinciaSeleccionada}
            onChange={(e) => {
              setProvinciaSeleccionada(e.target.value);
              setAdminId("");
            }}
          >
            <option value="">-- Selecciona una provincia --</option>
            {provincias.map((prov) => (
              <option key={prov.id} value={prov.nombre}>
                {prov.nombre}
              </option>
            ))}
          </select>

          {provinciaSeleccionada && adminsFiltrados.length > 0 && (
            <select
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
            >
              <option value="">-- Selecciona un administrador --</option>
              {adminsFiltrados.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.Nombre} {admin.Apellidos}
                </option>
              ))}
            </select>
          )}

          {provinciaSeleccionada && adminsFiltrados.length === 0 && (
            <p className="mensaje-error">
              No hay administradores disponibles en esta provincia.
            </p>
          )}

          <button type="submit" className="boton boton--añadir">
            Guardar Mecánico
          </button>
        </form>
      </div>
    </div>
  );
};
