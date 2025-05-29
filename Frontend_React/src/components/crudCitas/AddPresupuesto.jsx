import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { HeaderAdmin } from "../Admin/HeaderAdmin";
import { useNotificacionesStore } from "../../store/useNotificacionesStore";

export const AddPresupuesto = () => {
  const { usuarioId } = useParams();
  const navigate = useNavigate();
  const { dispararRecarga } = useNotificacionesStore();
  const location = useLocation();
  const citaId = location.state?.citaId;

  const [usuario, setUsuario] = useState(null);
  const [lineas, setLineas] = useState([
    { concepto: "", descripcion: "", precio: "", cantidad: 1 },
  ]);
  const [loading, setLoading] = useState(true);
  console.log(usuario);
  useEffect(() => {
    if (!citaId) {
      alert("No se ha proporcionado una cita para el presupuesto.");
    }

    const fetchUsuario = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/user/${usuarioId}`
        );
        if (!res.ok) throw new Error("Usuario no encontrado");

        const data = await res.json();
        setUsuario(data);
      } catch (err) {
        console.error("Error al cargar el usuario:", err.message);
        alert("Usuario no válido. Redirigiendo...");
        navigate("/employees/crud/citas");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [usuarioId, navigate]);

  const handleLineaChange = (index, field, value) => {
    const updatedLineas = [...lineas];
    updatedLineas[index][field] =
      field === "cantidad" ? parseInt(value) : value;
    setLineas(updatedLineas);
  };

  const agregarLinea = () => {
    setLineas([
      ...lineas,
      { concepto: "", descripcion: "", precio: "", cantidad: 1 },
    ]);
  };

  const eliminarLinea = (index) => {
    const updatedLineas = [...lineas];
    updatedLineas.splice(index, 1);
    setLineas(updatedLineas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hayErrores = lineas.some((l) => {
      return (
        !l.concepto ||
        isNaN(parseFloat(l.precio)) ||
        isNaN(parseInt(l.cantidad))
      );
    });

    if (hayErrores) {
      alert(
        "Revisa los campos. Todos los precios y cantidades deben ser válidos."
      );
      return;
    }

    try {
      const payload = {
        citaId,
        lineas: lineas.map((l) => ({
          concepto: l.concepto,
          descripcion: l.descripcion,
          precio: parseFloat(l.precio),
          cantidad: parseInt(l.cantidad),
        })),
      };

      const facturaRes = await fetch(
        `${import.meta.env.VITE_API_URL}/presupuesto/${usuarioId}/factura`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!facturaRes.ok) throw new Error("Error al crear la factura");

      await fetch(`${import.meta.env.VITE_API_URL}/notificacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: usuario.id,
          mensaje:
            "Se le ha asignado un presupuesto. Lo puede consultar en la seccion de facturas",
          tipo: "Presupuesto",
        }),
      });

      const { facturaId } = await facturaRes.json();
      if (!facturaId) throw new Error("No se recibió el ID de la factura");

      const emailRes = await fetch(
        `${import.meta.env.VITE_API_URL}/presupuesto/${usuarioId}/enviar`,
        {
          method: "POST",
        }
      );

      if (!emailRes.ok) throw new Error("Error al enviar el correo");

      dispararRecarga();
      console.log("🔔 Notificación: dispararRecarga() ejecutado");

      alert("Presupuesto creado y enviado con éxito.");
      navigate("/employees/crud/citas");
    } catch (error) {
      console.error("Error al enviar presupuesto:", error);
      alert("Error al procesar el presupuesto.");
    }
  };

  if (loading || !usuario) return <p>Cargando datos del usuario...</p>;

  return (
    <div>
      <HeaderAdmin />
      <div className="formulario-reparacion">
        <h2>Crear Presupuesto</h2>
        <p>
          <strong>Cliente:</strong> {usuario.nombre} {usuario.apellidos}
        </p>
        <p>
          <strong>Matrícula:</strong> {usuario.coches?.[0]?.Matricula || "N/A"}
        </p>

        <form onSubmit={handleSubmit}>
          {lineas.map((linea, index) => (
            <div
              key={index}
              className="linea-presupuesto"
              style={{ marginBottom: "1rem" }}
            >
              <input
                type="text"
                placeholder="Concepto"
                value={linea.concepto}
                onChange={(e) =>
                  handleLineaChange(index, "concepto", e.target.value)
                }
                required
                style={{ marginRight: "8px", padding: "6px" }}
              />
              <input
                type="text"
                placeholder="Descripción (opcional)"
                value={linea.descripcion}
                onChange={(e) =>
                  handleLineaChange(index, "descripcion", e.target.value)
                }
                style={{ marginRight: "8px", padding: "6px" }}
              />
              <input
                type="number"
                placeholder="Precio"
                step="0.01"
                value={linea.precio}
                onChange={(e) =>
                  handleLineaChange(index, "precio", e.target.value)
                }
                required
                style={{ width: "100px", marginRight: "8px", padding: "6px" }}
              />
              <input
                type="number"
                placeholder="Cantidad"
                value={linea.cantidad}
                min="1"
                onChange={(e) =>
                  handleLineaChange(index, "cantidad", e.target.value)
                }
                required
                style={{ width: "80px", marginRight: "8px", padding: "6px" }}
              />
              <button
                type="button"
                onClick={() => eliminarLinea(index)}
                style={{ padding: "6px" }}
              >
                Eliminar
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={agregarLinea}
            style={{ marginBottom: "1rem", padding: "8px 12px" }}
          >
            Añadir reparación
          </button>
          <br />
          <button
            type="submit"
            style={{ padding: "10px 20px", fontWeight: "bold" }}
          >
            Enviar presupuesto
          </button>
        </form>
      </div>
    </div>
  );
};
