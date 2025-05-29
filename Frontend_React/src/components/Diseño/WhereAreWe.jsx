import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export const WhereAreWe = () => {
  return (
    <>
      <Header />
      <div className="wherearewe">
        <div className="wherearewe__contenido">
          <h1 className="wherearewe__titulo">Dónde Estamos</h1>
          <p className="wherearewe__texto">
            Nuestra base está en <strong>Málaga, España</strong>, pero ofrecemos una plataforma digital que conecta talleres mecánicos y usuarios desde cualquier lugar de España.
          </p>
          <p className="wherearewe__texto">
            Si quieres saber más, colaborar o probar la aplicación en tu taller, no dudes en ponerte en contacto con nosotros.
          </p>

          <div className="wherearewe__mapa">
            <iframe
              title="Ubicación en España"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212179.19987218352!2d-4.624706257566813!3d36.719646401261144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72f79c992bcd1f%3A0x8cfe62de18b60b84!2sM%C3%A1laga!5e0!3m2!1ses!2ses!4v1680976936799!5m2!1ses!2ses"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
