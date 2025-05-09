import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import yo from '../assets/images/yo.jpeg'

export const Aboutus = () => {
  return (
    <>
      <Header />
      <div className="aboutus">
        <div className="aboutus__contenido">
          <h1 className="aboutus__titulo">Sobre el Proyecto</h1>

          <p className="aboutus__texto">
            Esta plataforma ha sido desarrollada como una solución digital para talleres mecánicos, con el fin de mejorar la experiencia del cliente, agilizar procesos internos y fomentar una comunicación más directa y eficiente.
          </p>

          <p className="aboutus__texto">
            Desde la gestión de reparaciones hasta la visualización del estado del vehículo y el historial de facturas, el proyecto ha sido diseñado para aportar valor real a la relación entre cliente y taller.
          </p>

          <h2 className="aboutus__subtitulo">¿Quién está detrás?</h2>
            <div className="aboutus__perfil">
                <div className="aboutus__perfil-info">
                    <p className="aboutus__texto">
                    Me llamo <strong>Pablo Fernandez</strong> y soy el desarrollador detrás de este proyecto. He trabajado tanto el desarrollo web (frontend y backend) como el diseño de experiencia de usuario, integrando tecnologías como React, Symfony y CSS personalizado.
                    </p>
                </div>
                
                <div className="aboutus__perfil-foto-contenedor">
                    <img
                    src={yo}
                    alt="Foto de Pablo"
                    className="aboutus__perfil-foto"
                    />
                    <div className="aboutus__contacto">
                    <p className="aboutus__texto">
                        Puedes contactarme en:
                    </p>
                    <p className="aboutus__contacto-links">
                        📧 <a href="mailto:pablo.tech.fernandez@gmail.com">pablo.tech.fernandez@gmail.com</a><br />
                        💼 <a href="https://www.linkedin.com/in/pablo-fernandez-garcia-daw/" target="_blank" rel="noreferrer">LinkedIn</a>
                    </p>
                    </div>
                </div>
            </div>

          <h2 className="aboutus__subtitulo">Línea de Tiempo del Proyecto</h2>
          <ul className="aboutus__timeline">
            <li>
              <span className="aboutus__timeline-fecha">Febrero 2025</span>
              <p>Inicio del diseño conceptual y definición de funcionalidades principales.</p>
            </li>
            <li>
              <span className="aboutus__timeline-fecha">Marzo 2025</span>
              <p>Desarrollo del backend con Symfony, diseño de base de datos y primeros endpoints REST.</p>
            </li>
            <li>
              <span className="aboutus__timeline-fecha">Abril 2025</span>
              <p>Implementación del frontend en React, integración con el backend y sistema de autenticación.</p>
            </li>
            <li>
              <span className="aboutus__timeline-fecha">Mayo 2025</span>
              <p>Estilo final, pruebas de usabilidad, corrección de errores y despliegue.</p>
            </li>
          </ul>

          <p className="aboutus__firma">Gracias por visitar y formar parte de esta evolución digital.</p>
        </div>
      </div>
      <Footer />
    </>
  );
};
