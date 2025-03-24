import React from 'react';

export const Newsletter = () => {
  return (
    <section className="newsletter">
      <div className="newsletter__contenido">
        <h2 className="newsletter__titulo">Suscríbete a nuestro boletín</h2>
        <form className="newsletter__formulario">
          <input 
            type="email" 
            placeholder="Ingresa tu correo electrónico"
            className="newsletter__input"
          />
          <button type="submit" className="boton newsletter__boton">
            Suscribirse
          </button>
        </form>
      </div>
    </section>
  );
};