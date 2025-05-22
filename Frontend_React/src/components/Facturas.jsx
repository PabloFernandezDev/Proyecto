import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./Header";

export const Facturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  console.log(facturas)
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

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-ES");
  };

  return (
    <div>
      <Header />
      <div className="facturas-panel">
        <h2>Mis Facturas</h2>
        {loading ? (
          <p>Cargando facturas...</p>
        ) : facturas.length === 0 ? (
          <p>No tienes facturas registradas.</p>
        ) : (
          <div className="facturas-grid">
            {facturas.map((factura) => (
              <div key={factura.id} className="factura-card">
                <p><strong>Nº:</strong> {factura.numero}</p>
                <p><strong>Fecha:</strong> {formatearFecha(factura.fechaEmision)}</p>
                <p><strong>Total:</strong> {factura.total.toFixed(2)} €</p>
                <button onClick={() => navigate(`/home/factura/${factura.id}/detalle`)}>
                  Ver Detalles
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
