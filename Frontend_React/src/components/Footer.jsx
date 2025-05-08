import React from 'react';
import Icon from '../assets/Icon';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__contenedor">
        <div className="footer__columna">
          <h3 className="footer__titulo">CarCareNow</h3>
          <p className="footer__descripcion">
            Conectamos tecnología con confianza para que tu experiencia en el taller sea más clara, rápida y segura.
          </p>
        </div>

        <div className="footer__columna">
          <h4>Enlaces útiles</h4>
          <ul className="footer__enlaces">
            <li><a href="#">Términos y condiciones</a></li>
            <li><a href="#">Política de privacidad</a></li>
            <li><a href="#">Ayuda</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </div>

        <div className="footer__columna">
          <h4>Contáctanos</h4>
          <p>Email: soporte@tutallerplus.com</p>
          <p>Teléfono: +34 600 123 456</p>
          <h4>Síguenos</h4>
          <div className="footer__iconos">
            <Icon icon="youtube" size={30} color="white" />
            <Icon icon="twitter" size={30} color="white" />
            <Icon icon="instagram" size={30} color="white" />
            <Icon icon="facebook, brand, social" size={30} color="white" />
          </div>
        </div>
      </div>

      <div className="footer__copy">
        © 2025 Pablo Fernández García. Todos los derechos reservados.
      </div>
    </footer>
  );
};
