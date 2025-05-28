import React, { useEffect, useState } from "react";
import { HeaderAdmin } from "../HeaderAdmin";
import { useNavigate } from "react-router-dom";

export const LeerAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [provinciaFiltro, setProvinciaFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

    const navigate = useNavigate();
  
    
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admins`)
      .then((res) => res.json())
      .then((data) => setAdmins(data))
      .catch((error) =>
        console.error("Error al cargar administradores:", error)
      );
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [filtro, provinciaFiltro]);

  const handleEliminar = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/${id}/delete`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setAdmins((prev) => prev.filter((admin) => admin.id !== id));
      } else {
        console.error("Error al eliminar administrador");
      }
    } catch (error) {
      console.error("Error de red al eliminar administrador:", error);
    }
  };

  const provincias = [
    ...new Set(admins.map((a) => a.taller?.provincia?.nombre).filter(Boolean)),
  ];

  const adminsFiltrados = admins.filter((admin) => {
    if (admin.rol === "SUPER_ADMIN") return false;
    const texto = filtro.toLowerCase();
    const nombreCompleto = `${admin.Nombre} ${admin.Apellidos}`.toLowerCase();
    const numEmp = admin.NumEmp?.toString().toLowerCase();
    const provincia = admin.taller?.provincia?.nombre.toLowerCase() || "";
    return (
      (nombreCompleto.includes(texto) || numEmp.includes(texto)) &&
      (provinciaFiltro === "" || provincia === provinciaFiltro.toLowerCase())
    );
  });

  const totalPaginas = Math.ceil(adminsFiltrados.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const adminsEnPagina = adminsFiltrados.slice(
    indiceInicio,
    indiceInicio + elementosPorPagina
  );

  return (
    <div>
      <HeaderAdmin />
      <div className="leer-users">
        <h2>Administradores</h2>
        <button
          className="btn-volver"
          onClick={() => navigate("/employees/admin/panel")}
        >
          Volver al Panel
        </button>
        <button
          className="btn-crear"
          onClick={() => navigate("/employees/crud/admins/addAdmin")}
        >
          Añadir Administrador
        </button>
        <div className="filtros-superiores">
          <input
            type="text"
            placeholder="Buscar por nombre, apellidos o número de empleado"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="buscador"
          />

          <select
            className="buscador"
            value={provinciaFiltro}
            onChange={(e) => setProvinciaFiltro(e.target.value)}
          >
            <option value="">Todas las provincias</option>
            {provincias.map((prov, i) => (
              <option key={i} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        <div className="tabla-contenedor">
          <table className="tabla-usuarios">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Número Empleado</th>
                <th>Provincia</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {adminsEnPagina.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.Nombre}</td>
                  <td>{admin.Apellidos}</td>
                  <td>{admin.NumEmp}</td>
                  <td>{admin.taller?.provincia?.nombre}</td>
                  <td>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleEliminar(admin.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {adminsFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No se encontraron administradores.
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
