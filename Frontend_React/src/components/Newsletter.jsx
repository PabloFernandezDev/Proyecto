import React, { useState } from 'react';

export const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Suscrito:', email);
    setEmail('');
  };

  return (
    <section className="newsletter">
      <div className="newsletter__contenedor">
        <h2 className="newsletter__titulo">¿Quieres estar al día?</h2>
        <p className="newsletter__descripcion">
          Suscríbete a nuestro boletín para recibir notificaciones sobre ofertas especiales, mantenimientos recomendados y consejos útiles para tu vehículo.
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
      </div>
    </section>
  );
};
