import React, { useState } from "react";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeExito("");
    setMensajeError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/enviar/gmail/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Error al enviar el correo");

      const data = await res.json();
      setMensajeExito("¡Gracias por suscribirte! Revisa tu bandeja de entrada.");
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      setMensajeError("No se pudo enviar el correo. Inténtalo más tarde.");
    }
  };

  return (
    <section className="newsletter">
      <div className="newsletter__contenedor">
        <h2 className="newsletter__titulo">¿Quieres estar al día?</h2>
        <p className="newsletter__descripcion">
          Suscríbete a nuestro boletín para recibir notificaciones sobre ofertas
          especiales, mantenimientos recomendados y consejos útiles para tu
          vehículo.
        </p>

        <form onSubmit={handleSubmit} className="newsletter__formulario">
          <input
            type="email"
            placeholder="Ingresa tu correo electrónico"
            className="newsletter__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="newsletter__boton">
            Suscribirme
          </button>
        </form>

        {mensajeExito && <p className="newsletter__mensaje-exito">{mensajeExito}</p>}
        {mensajeError && <p className="newsletter__mensaje-error">{mensajeError}</p>}
      </div>
    </section>
  );
};
