import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderAdmin } from "../Admin/HeaderAdmin";

export const LeerMecanicos = () => {
  const [mecanicos, setMecanicos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [provincias, setProvincias] = useState([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const mecanicosPorPagina = 10;

    const navigate = useNavigate();
  
    
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/provincias`)
      .then((res) => res.json())
      .then((data) => setProvincias(data))
      .catch((error) => {
        console.error("Error al cargar provincias:", error);
        alert("No se pudieron cargar las provincias");
      });
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/mecanicos`)
      .then((res) => res.json())
      .then((data) => setMecanicos(data))
      .catch((error) => {
        console.error("Error al cargar mecánicos:", error);
        alert("No se pudieron cargar los mecánicos");
      });
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [filtro, provinciaSeleccionada]);

  const eliminarMecanico = async (id) => {
    if (!window.confirm("¿Eliminar este mecánico?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/mecanico/${id}/delete`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.detail || "Error desconocido");
        return;
      }

      setMecanicos((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de red al conectar con el servidor");
    }
  };

  const mecanicosFiltrados = mecanicos.filter((mec) => {
    const texto = filtro.toLowerCase();

    const coincideFiltroTexto =
      mec.NumEmp?.toString().includes(texto) ||
      mec.Nombre?.toLowerCase().includes(texto) ||
      mec.Apellidos?.toLowerCase().includes(texto) ||
      mec.administrador?.Nombre?.toLowerCase().includes(texto) ||
      mec.administrador?.Apellidos?.toLowerCase().includes(texto);

    const coincideProvincia =
      !provinciaSeleccionada ||
      mec.administrador?.taller?.provincia?.nombre === provinciaSeleccionada;

    return coincideFiltroTexto && coincideProvincia;
  });

  const totalPaginas = Math.ceil(
    mecanicosFiltrados.length / mecanicosPorPagina
  );
  const indiceInicio = (paginaActual - 1) * mecanicosPorPagina;
  const indiceFin = indiceInicio + mecanicosPorPagina;
  const mecanicosEnPagina = mecanicosFiltrados.slice(indiceInicio, indiceFin);

  return (
    <div>
      <HeaderAdmin />
      <div className="leer-users">
        <h2>Todos los Mecánicos</h2>
        <button
          className="btn-volver"
          onClick={() => navigate("/employees/admin/panel")}
        >
          Volver al Panel
        </button>
        <div className="filtros-superiores">
          <input
            type="text"
            placeholder="Buscar por número empleado, nombre o apellidos, administrador..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="buscador"
          />

          <select
            value={provinciaSeleccionada}
            onChange={(e) => setProvinciaSeleccionada(e.target.value)}
            className="selector-provincia"
          >
            <option value="">-- Todas las provincias --</option>
            {provincias.map((prov) => (
              <option key={prov.id} value={prov.nombre}>
                {prov.nombre}
              </option>
            ))}
          </select>
          <button className="btn-volver" onClick={() => navigate("/employees/crud/mecanicos/addMecanico")}>
          Añadir Mecanico
        </button>
        </div>

        <div className="tabla-contenedor">
          <table className="tabla-usuarios">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Nº Empleado</th>
                <th>Administrador</th>
                <th>Provincia</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mecanicosEnPagina.map((m) => (
                <tr key={m.id}>
                  <td>{m.Nombre}</td>
                  <td>{m.Apellidos}</td>
                  <td>{m.NumEmp}</td>
                  <td>
                    {m.administrador?.Nombre} {m.administrador?.Apellidos}
                  </td>
                  <td>{m.administrador?.taller?.provincia?.nombre}</td>
                  <td>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarMecanico(m.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {mecanicosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No se encontraron mecánicos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="paginacion">
            <button
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
            >
              Anterior
            </button>
            <button
              onClick={() =>
                setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
              }
              disabled={paginaActual === totalPaginas || totalPaginas === 0}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
