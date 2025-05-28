import React, { useEffect, useState } from "react";
import { HeaderAdmin } from "../HeaderAdmin";
import { useNavigate } from "react-router-dom";

export const LeerCochesSuperAdmin = () => {
  const [coches, setCoches] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [filtroGeneral, setFiltroGeneral] = useState("");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
  const [modeloSeleccionado, setModeloSeleccionado] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const cochesPorPagina = 10;

  const navigate = useNavigate();
  
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/coches`)
      .then((res) => res.json())
      .then((data) => setCoches(data))
      .catch((error) => console.error("Error al cargar coches:", error));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/marcas`)
      .then((res) => res.json())
      .then((data) => setMarcas(data))
      .catch((error) => console.error("Error al cargar marcas:", error));
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [filtroGeneral, marcaSeleccionada, modeloSeleccionado]);

  const eliminarCoche = async (id) => {
    if (!window.confirm("¿Eliminar este coche?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/coche/${id}/delete`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Error desconocido");
      }

      setCoches((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message);
      console.error("Error al eliminar coche:", err);
    }
  };

  const cochesFiltrados = coches.filter((coche) => {
    const textoFiltro = filtroGeneral.toLowerCase();
    const nombreCompleto = `${coche.usuario?.nombre ?? ""} ${
      coche.usuario?.apellidos ?? ""
    }`.toLowerCase();
    const matricula = coche.Matricula?.toLowerCase() ?? "";

    const coincideTexto =
      nombreCompleto.includes(textoFiltro) || matricula.includes(textoFiltro);

    const coincideMarca =
      !marcaSeleccionada || coche.marca?.nombre === marcaSeleccionada;

    const coincideModelo =
      !modeloSeleccionado || coche.modelo?.nombre === modeloSeleccionado;

    return coincideTexto && coincideMarca && coincideModelo;
  });

  const totalPaginas = Math.ceil(cochesFiltrados.length / cochesPorPagina);
  const indiceInicio = (paginaActual - 1) * cochesPorPagina;
  const cochesEnPagina = cochesFiltrados.slice(
    indiceInicio,
    indiceInicio + cochesPorPagina
  );

  const modelosDisponibles =
    marcas.find((m) => m.nombre === marcaSeleccionada)?.modelos || [];

  return (
    <div>
      <HeaderAdmin />
      <div className="leer-users">
        <h2>Todos los Coches</h2>
        <button
          className="btn-volver"
          onClick={() => navigate("/employees/admin/panel")}
        >
          Volver al Panel
        </button>
        <div className="filtros-superiores">
          <input
            type="text"
            placeholder="Buscar por nombre, apellidos o matrícula"
            value={filtroGeneral}
            onChange={(e) => setFiltroGeneral(e.target.value)}
            className="buscador"
          />
          <select
            value={marcaSeleccionada}
            onChange={(e) => setMarcaSeleccionada(e.target.value)}
            className="selector-provincia"
          >
            <option value="">-- Todas las marcas --</option>
            {marcas.map((marca) => (
              <option key={marca.nombre} value={marca.nombre}>
                {marca.nombre}
              </option>
            ))}
          </select>
          <select
            value={modeloSeleccionado}
            onChange={(e) => setModeloSeleccionado(e.target.value)}
            disabled={!marcaSeleccionada}
            className="selector-provincia"
          >
            <option value="">-- Todos los modelos --</option>
            {modelosDisponibles.map((modelo) => (
              <option key={modelo.nombre} value={modelo.nombre}>
                {modelo.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="tabla-contenedor">
          <table className="tabla-usuarios">
            <thead>
              <tr>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Año</th>
                <th>Matrícula</th>
                <th>Usuario</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cochesEnPagina.map((c) => (
                <tr key={c.id}>
                  <td>{c.marca?.nombre}</td>
                  <td>{c.modelo?.nombre}</td>
                  <td>{c.año ?? ""}</td>
                  <td>{c.Matricula}</td>
                  <td>
                    {c.usuario?.nombre} {c.usuario?.apellidos}
                  </td>
                  <td>{c.taller ? "Reparación pendiente" : "Correcto"}</td>
                  <td>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarCoche(c.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {cochesFiltrados.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No se encontraron coches.
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
