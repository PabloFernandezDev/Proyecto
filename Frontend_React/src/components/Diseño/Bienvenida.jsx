import React from "react";
import taller from '../../assets/images/taller.png';

export const Bienvenida = () => {
  return (
    <section className="bienvenida">
      <div className="bienvenida__contenido">
        <figure className="bienvenida__imagen">
          <img src={taller} alt="Taller mecánico" />
        </figure>
        <div className="bienvenida__texto">
          <h2 className="bienvenida__titulo">Bienvenido a CarCareNow+</h2>
          <p>
            En <b>CarCareNow</b> modernizamos tu experiencia con el taller mecánico. Ya no tendrás que 
            llamar o esperar por respuestas: te informamos de cada paso en tiempo real, desde el diagnóstico 
            hasta la recogida del vehículo.
          </p>
          <p>
            Nuestro objetivo es que tengas el control total de tu coche o moto, con acceso al historial completo, 
            facturas, citas y notificaciones automáticas desde tu móvil o computador.
          </p>
          <p>
            Confía en nosotros para una experiencia transparente, segura y totalmente digital. Bienvenido a la nueva era 
            del mantenimiento automotriz.
          </p>
        </div>
      </div>
    </section>
  );
};
