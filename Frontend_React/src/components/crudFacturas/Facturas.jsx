import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../Diseño/Header";

export const Facturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [filtroNumero, setFiltroNumero] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const facturasPorPagina = 10;
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const obtenerFacturas = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/facturas/${userId}`);
        if (!res.ok) throw new Error("Error al obtener facturas");
        const data = await res.json();
        setFacturas(data);
      } catch (error) {
        console.error("Error:", error);
        alert("No se pudieron cargar las facturas.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      obtenerFacturas();
    }
  }, [userId]);

  useEffect(() => {
    setPaginaActual(1);
  }, [filtroNumero, filtroFecha]);

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-ES");
  };

  const facturasFiltradas = facturas.filter((factura) => {
    const coincideNumero = factura.numero?.toString().includes(filtroNumero);
    const coincideFecha = filtroFecha === "" || factura.fechaEmision.startsWith(filtroFecha);
    return coincideNumero && coincideFecha;
  });

  const totalPaginas = Math.ceil(facturasFiltradas.length / facturasPorPagina);
  const inicio = (paginaActual - 1) * facturasPorPagina;
  const fin = inicio + facturasPorPagina;
  const facturasEnPagina = facturasFiltradas.slice(inicio, fin);

  return (
    <div>
      <Header />
      <div className="leer-users">
        <h2>Mis Facturas</h2>

        <div className="filtros-superiores">
          <input
            type="text"
            placeholder="Buscar por número de factura..."
            value={filtroNumero}
            onChange={(e) => setFiltroNumero(e.target.value)}
            className="buscador"
          />
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="selector-provincia"
          />
        </div>

        {loading ? (
          <p>Cargando facturas...</p>
        ) : (
          <div className="tabla-contenedor">
            <table className="tabla-usuarios">
              <thead>
                <tr>
                  <th>Nº</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturasEnPagina.length > 0 ? (
                  facturasEnPagina.map((factura) => (
                    <tr key={factura.id}>
                      <td>{factura.numero}</td>
                      <td>{formatearFecha(factura.fechaEmision)}</td>
                      <td>{factura.total.toFixed(2)} €</td>
                      <td>
                        <button
                          className="btn-ver"
                          onClick={() => navigate(`/home/factura/${factura.id}/detalle`)}
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No se encontraron facturas.
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
        )}
      </div>
    </div>
  );
};
