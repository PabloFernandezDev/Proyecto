import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderAdmin } from "../Admin/HeaderAdmin";

export const LeerUsers = () => {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 10;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/users`)
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Error al cargar usuarios:", error));
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [filtro]);

  const eliminarUsuario = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${id}/delete`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
      } else {
        console.error("Error al eliminar usuario");
      }
    } catch (error) {
      console.error("Error de red al eliminar usuario:", error);
    }
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const texto = filtro.toLowerCase();
    return (
      usuario.nombre?.toLowerCase().includes(texto) ||
      usuario.apellidos?.toLowerCase().includes(texto) ||
      usuario.dni?.toLowerCase().includes(texto) ||
      usuario.email?.toLowerCase().includes(texto)
    );
  });

  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  const indiceInicio = (paginaActual - 1) * usuariosPorPagina;
  const usuariosEnPagina = usuariosFiltrados.slice(
    indiceInicio,
    indiceInicio + usuariosPorPagina
  );

  return (
    <div>
      <HeaderAdmin />
      <div className="leer-users">
        <h2>Usuarios Registrados</h2>

        <div className="filtros-superiores">
          <input
            type="text"
            placeholder="Buscar por nombre, apellidos, DNI o email"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="buscador"
          />
          <button
            className="btn-volver"
            onClick={() => navigate("/employees/admin/panel")}
          >
            Volver
          </button>
        </div>

        <div className="tabla-contenedor">
          <table className="tabla-usuarios">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>DNI</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosEnPagina.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellidos}</td>
                  <td>{usuario.dni}</td>
                  <td>{usuario.telefono}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarUsuario(usuario.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No se encontraron usuarios.
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
