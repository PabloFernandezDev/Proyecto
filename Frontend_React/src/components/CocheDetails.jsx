import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';

export const CocheDetails = () => {
  const [coche, setCoche] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/user/${userId}/coche`)
      .then(res => res.json())
      .then(data => setCoche(data))
      .catch(err => console.error('Error cargando detalles del coche:', err));
  }, [userId]);

  const handleEliminarCoche = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este coche?')) {
      fetch(`http://127.0.0.1:8000/user/${userId}/coche`, {
        method: 'DELETE',
      })
        .then(() => {
          alert('Coche eliminado correctamente.');
          navigate('/home');
        })
        .catch(err => console.error('Error al eliminar coche:', err));
    }
  };

  return (
    <>
      <Header />
      <div className="coche-details">
        <h2 className="coche-details__titulo">Detalle del Coche</h2>
        {coche ? (
          <div className="coche-details__contenido">
            <div className="coche-details__imagen">
              <img src={`http://127.0.0.1:8000/uploads/${coche.imagen}`} alt="Imagen del coche" />
            </div>
            <div className="coche-details__info">
              <p><strong>Marca:</strong> {coche.marca.nombre}</p>
              <p><strong>Modelo:</strong> {coche.modelo.nombre}</p>
              <p><strong>Año:</strong> {coche.año}</p>
              <button className="boton boton--eliminar" onClick={handleEliminarCoche}>
                Eliminar Coche
              </button>
            </div>
          </div>
        ) : (
          <p>Cargando información del coche...</p>
        )}
      </div>
    </>
  );
};
