import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderAdmin } from "../HeaderAdmin";

export const AddAdmin = () => {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [numEmp, setNumEmp] = useState("");
  const [password, setPassword] = useState("");
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
  const [tallerSeleccionado, setTallerSeleccionado] = useState("");
  const [admins, setAdmins] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admins`)
      .then((res) => res.json())
      .then((data) => setAdmins(data))
      .catch((err) => {
        console.error("Error al cargar administradores:", err);
        alert("No se pudieron cargar los administradores.");
      });
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/provincias`)
      .then((res) => res.json())
      .then((data) => setProvincias(data))
      .catch((err) => {
        console.error("Error al cargar provincias:", err);
        alert("No se pudieron cargar las provincias.");
      });
  }, []);

  const provinciasUnicas = [
    ...new Set(
      admins.map((admin) => admin.taller?.provincia?.nombre).filter(Boolean)
    ),
  ];

  const talleresFiltrados = [
    ...new Map(
      admins
        .filter(
          (admin) =>
            admin.rol === "ADMIN" &&
            admin.taller?.provincia?.nombre === provinciaSeleccionada
        )
        .map((admin) => [
          admin.taller?.id,
          {
            id: admin.taller?.id,
            direccion: admin.taller?.direccion,
          },
        ])
    ).values(),
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !apellidos || !numEmp || !password || !tallerSeleccionado) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const body = {
      Nombre: nombre,
      Apellidos: apellidos,
      NumEmp: parseInt(numEmp),
      password,
      tallerId: parseInt(tallerSeleccionado),
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Error desconocido");
      }

      navigate("/employees/crud/admins");
    } catch (err) {
      console.error("Error al crear administrador:", err);
      setError(err.message);
    }
  };

  return (
    <div>
      <HeaderAdmin />
      <div className="form-container">
        <h2>Añadir Administrador</h2>
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
              setTallerSeleccionado("");
            }}
          >
            <option value="">-- Selecciona una provincia --</option>
            {provinciasUnicas.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>

          {provinciaSeleccionada && talleresFiltrados.length > 0 && (
            <select
              value={tallerSeleccionado}
              onChange={(e) => setTallerSeleccionado(e.target.value)}
            >
              <option value="">-- Selecciona dirección del taller --</option>
              {talleresFiltrados.map((taller, index) => (
                <option key={index} value={taller.id}>
                  {taller.direccion}
                </option>
              ))}
            </select>
          )}

          {provinciaSeleccionada && talleresFiltrados.length === 0 && (
            <p className="mensaje-error">
              No hay talleres disponibles en esta provincia.
            </p>
          )}

          <button type="submit" className="boton boton--añadir">
            Guardar Administrador
          </button>
        </form>
      </div>
    </div>
  );
};
