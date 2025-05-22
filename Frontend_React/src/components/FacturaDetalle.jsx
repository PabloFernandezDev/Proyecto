import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Header } from "./Header";

export const FacturaDetalle = () => {
  const { id } = useParams();
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(true);
  const facturaRef = useRef();

  useEffect(() => {
    const fetchFactura = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/factura/${id}`);
        if (!res.ok) throw new Error("Error al cargar la factura");
        const data = await res.json();
        setFactura(data);
      } catch (error) {
        console.error("Error:", error);
        alert("No se pudo cargar la factura");
      } finally {
        setLoading(false);
      }
    };

    fetchFactura();
  }, [id]);

  const descargarPDF = () => {
    const input = facturaRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = 210;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Factura-${factura.numero || id}.pdf`);
    });
  };

  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleDateString("es-ES");

  if (loading) return <p>Cargando factura...</p>;
  if (!factura) return <p>Factura no encontrada</p>;

  return (
    <div>
      <Header />
      <div className="factura-detalle-container">
        <div className="factura-detalle" ref={facturaRef}>
          <div className="factura-header">
            <h1>Factura</h1>
            <p className="factura-numero">Nº {factura.numero}</p>
            <p className="factura-fecha">
              Fecha: {formatearFecha(factura.fechaEmision)}
            </p>
          </div>

          <div className="factura-datos">
            <div>
              <h4>De:</h4>
              <p>CareCareNow</p>
              <p>NIF: B12345678</p>
            </div>
            <div>
              <h4>Para:</h4>
              <p>
                {factura.usuario?.nombre} {factura.usuario?.apellidos}
              </p>
              <p>DNI: {factura.usuario?.dni}</p>
              <p>Teléfono: {factura.usuario?.telefono}</p>
              <p>Email: {factura.usuario?.email}</p>
            </div>
          </div>

          <table className="factura-tabla">
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Importe</th>
              </tr>
            </thead>
            <tbody>
              {factura.lineaFactura.map((linea) => (
                <tr key={linea.id}>
                  <td>{linea.concepto || "—"}</td>
                  <td>{linea.descripcion || "—"}</td>
                  <td>{linea.precio?.toFixed(2) || "—"} €</td>
                  <td>{linea.cantidad || "—"}</td>
                  <td>{linea.total?.toFixed(2) || "—"} €</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="factura-totales">
            <p>Subtotal: {factura.subtotal.toFixed(2)} €</p>
            <p>IVA (21%): {factura.iva.toFixed(2)} €</p>
            <h3>Total: {factura.total.toFixed(2)} €</h3>
            <p>Método de pago: {factura.metodoPago}</p>
          </div>
        </div>

        <button className="boton-descargar" onClick={descargarPDF}>
          Descargar PDF
        </button>
      </div>
    </div>
  );
};
