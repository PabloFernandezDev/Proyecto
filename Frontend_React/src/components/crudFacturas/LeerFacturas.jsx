import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderAdmin } from "../HeaderAdmin";

export const LeerFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const facturasPorPagina = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/facturas`)
      .then((res) => res.json())
      .then((data) => setFacturas(data))
      .catch((error) => console.error("Error al cargar facturas:", error));
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [filtro, filtroFecha]);

  const eliminarFactura = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/factura/${id}/delete`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setFacturas((prev) => prev.filter((f) => f.id !== id));
      } else {
        console.error("Error al eliminar factura");
      }
    } catch (error) {
      console.error("Error de red al eliminar factura:", error);
    }
  };

  const facturasFiltradas = facturas.filter((factura) => {
    const numero = factura.numero?.toString().toLowerCase() || "";
    const fecha = factura.fechaEmision?.substring(0, 10) || "";
    const usuario = `${factura.usuario?.nombre ?? ""} ${
      factura.usuario?.apellidos ?? ""
    }`.toLowerCase();
    const texto = filtro.toLowerCase();

    return (
      (numero.includes(texto) || usuario.includes(texto)) &&
      fecha.includes(filtroFecha)
    );
  });

  const totalPaginas = Math.ceil(facturasFiltradas.length / facturasPorPagina);
  const indiceInicio = (paginaActual - 1) * facturasPorPagina;
  const facturasEnPagina = facturasFiltradas.slice(
    indiceInicio,
    indiceInicio + facturasPorPagina
  );

  return (
    <div>
      <HeaderAdmin />
      <div className="leer-users">
        <h2>Listado de Facturas</h2>

        <button
          className="btn-volver"
          onClick={() => navigate("/employees/admin/panel")}
        >
          Volver al Panel
        </button>  
        <div className="filtros-superiores">
          <input
            type="text"
            placeholder="Buscar por número o usuario"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="buscador"
          />
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="buscador"
          />
        </div>

        <div className="tabla-contenedor">
          <table className="tabla-usuarios">
            <thead>
              <tr>
                <th>Número</th>
                <th>Fecha Emisión</th>
                <th>Total</th>
                <th>Usuario</th>
                <th>Método de Pago</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturasEnPagina.map((factura) => (
                <tr key={factura.id}>
                  <td>{factura.numero}</td>
                  <td>{factura.fechaEmision?.substring(0, 10)}</td>
                  <td>{factura.total} €</td>
                  <td>
                    {factura.usuario?.nombre} {factura.usuario?.apellidos}
                  </td>
                  <td>{factura.metodoPago}</td>
                  <td>
                    <button
                      className="dashboard__boton-detalles"
                      onClick={() =>
                        navigate(
                          `/employees/crud/facturas/${factura.id}/detalle`
                        )
                      }
                    >
                      Detalles
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarFactura(factura.id)}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
              {facturasFiltradas.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
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
      </div>
    </div>
  );
};
