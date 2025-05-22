import React, { useEffect, useState } from "react";
import { HeaderAdmin } from "../HeaderAdmin";
import { useNavigate } from "react-router-dom";

export const LeerMecanicos = () => {
  const [mecanicos, setMecanicos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [mecanicosFiltrados, setMecanicosFiltrados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("Admin"));
    const adminId = admin?.idAdmin;

    if (!adminId) return;

    fetch(`http://127.0.0.1:8000/admin/${adminId}/mecanicos`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener mecánicos");
        return res.json();
      })
      .then((data) => {
        setMecanicos(data);
        setMecanicosFiltrados(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("No se pudieron cargar los mecánicos");
      });
  }, []);

  useEffect(() => {
    const texto = filtro.toLowerCase();
    const filtrados = mecanicos.filter((mec) =>
      mec.numEmp?.toString().includes(texto) ||
      mec.Nombre?.toLowerCase().includes(texto) ||
      mec.Apellidos?.toLowerCase().includes(texto)
    );
    setMecanicosFiltrados(filtrados);
  }, [filtro, mecanicos]);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este mecánico?")) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/mecanico/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Error al eliminar");

        setMecanicos((prev) => prev.filter((m) => m.id !== id));
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("No se pudo eliminar el mecánico");
      }
    }
  };

  return (
    <div>
      <HeaderAdmin />
      <div className="listado-mecanicos__container">
        <h2>Mecánicos</h2>

        <div className="acciones-superiores">
          <input
            type="text"
            placeholder="Buscar por número, nombre o apellidos..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="buscador"
          />
          <button
            className="boton boton--añadir"
            onClick={() => navigate("/employees/crud/mecanicos/add")}
          >
            Añadir Mecánico
          </button>
        </div>

        {mecanicosFiltrados.length > 0 ? (
          <ul className="lista-mecanicos">
            {mecanicosFiltrados.map((mecanico) => (
              <li key={mecanico.id} className="mecanico-item">
                <p><strong>{mecanico.Nombre} {mecanico.Apellidos}</strong></p>
                <p>Nº Empleado: {mecanico.numEmp}</p>
                <button
                  className="boton boton--eliminar"
                  onClick={() => handleEliminar(mecanico.id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron mecánicos con ese criterio.</p>
        )}
      </div>
    </div>
  );
};
