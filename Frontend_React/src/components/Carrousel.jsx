import React, { useState } from 'react';
import Icon from '../assets/Icon';
import imagenMecanico from '../assets/images/mecanico.png';
import itv from '../assets/images/itv.png';
import notificaciones from '../assets/images/notificaciones.jpeg';
import recambios from '../assets/images/recambios.png';

export const Carrousel = () => {
  const servicios = [
    { img: imagenMecanico, texto: 'Servicio profesional de reparación' },
    { img: itv, texto: 'Pre-ITV y revisiones completas' },
    { img: notificaciones, texto: 'Notificaciones automáticas en tiempo real' },
    { img: recambios, texto: 'Piezas de recambio originales' }
  ];

  

  const visibleCount = 3;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(''); 
  const [animationClass, setAnimationClass] = useState('');

  const handlePrevious = () => {
    setAnimationClass('slide-left');
    setTimeout(() => setAnimationClass(''), 300); 
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + servicios.length) % servicios.length
    );
  };
  
  const handleNext = () => {
    setAnimationClass('slide-right');
    setTimeout(() => setAnimationClass(''), 300);
    setCurrentIndex((prevIndex) =>
      (prevIndex + 1) % servicios.length
    );
  };
  
  

  const visibleServicios = Array.from({ length: visibleCount }, (_, i) =>
    servicios[(currentIndex + i) % servicios.length]
  );

  return (
    <div className="caja">
      <div className="carousel-container">
        <button className="carousel-button left" onClick={handlePrevious}>
          <Icon icon="cheveron-left" size={50} color="black" />
        </button>

        <div className="carousel-viewport">
          <div className={`carousel-wrapper ${animationClass}`}>
            {visibleServicios.map((servicio, idx) => (
              <div className="carousel-item" key={idx}>
                <img src={servicio.img} alt={`Servicio ${idx}`} className="carousel-image" />
                <div className="carousel-text-overlay">
                  <p>{servicio.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="carousel-button right" onClick={handleNext}>
          <Icon icon="cheveron-right" size={50} color="black" />
        </button>
      </div>
    </div>
  );
};
