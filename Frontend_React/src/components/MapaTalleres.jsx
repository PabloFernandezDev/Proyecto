import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 6);
    }
  }, [center, map]);
  return null;
};

export const MapaTalleres = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [talleres, setTalleres] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error('No se pudo obtener la ubicación:', err);
      },
      { enableHighAccuracy: true }
    );

    fetch(`${import.meta.env.VITE_API_URL}/talleres`)
      .then(res => res.json())
      .then(data => setTalleres(data))
      .catch(err => console.error('Error al cargar talleres:', err));
  }, []);

  if (!userLocation) return <p style={{ textAlign: 'center' }}>Cargando mapa...</p>;

  return (
    <MapContainer center={userLocation} zoom={6} style={{ height: '100%', width: '100%', borderRadius: '12px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <RecenterMap center={userLocation} />

      <Marker position={userLocation}>
        <Popup>Tu ubicación</Popup>
      </Marker>

      {talleres.map((taller, i) => (
        <Marker key={i} position={[taller.latitud, taller.longitud]}>
          <Popup>
            <strong>{taller.direccion}</strong><br />
            {taller.provincia.nombre}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
