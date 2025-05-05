// frontend/src/app/portal/eventos/maps/google/Mapa.tsx
"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Location {
  lat: number;
  lng: number;
  apellido: string;
  nombres: string;
  lpu: string;
  tipoDoc: string;
  numeroDni: string;
  cualorg: string;
  condicion: string;
  imagen?: string;
}

interface MapaProps {
  locations: Location[];
  isMapExpanded: boolean;
  toggleMapExpand: () => void;
}

const Mapa: React.FC<MapaProps> = ({ locations, isMapExpanded, toggleMapExpand }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.remove(); // Destruir el mapa existente
    }

    const map = L.map('map', {
      center: [locations[0]?.lat || 37.4221, locations[0]?.lng || -122.0841],
      zoom: 15,
      closePopupOnClick: false // Deshabilitar el cierre de popups al hacer clic en el mapa
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    locations.forEach(location => {
      const marker = L.marker([location.lat, location.lng]).addTo(map);
      const circle = L.circle([location.lat, location.lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.4,
        radius: 3000
      }).addTo(map);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const popupContent = `
      <div>
      ${location.imagen ? `<img src="${backendUrl}/ingresos/uploads/${location.imagen}" alt="Imagen del ingreso" width="150" height="150" style="border-radius: 8px;" />` : ''}
        <p style="margin-top: 0; margin-bottom: 0;"><strong>Apellido:</strong> ${location.apellido}</p>
        <p style="margin-top: 0; margin-bottom: 0;"><strong>Nombres:</strong> ${location.nombres}</p>
        <p style="margin-top: 0; margin-bottom: 0;"><strong>LPU:</strong> ${location.lpu}</p>
        <p style="margin-top: 0; margin-bottom: 0;"><strong>Doc.:</strong> ${location.tipoDoc}: ${location.numeroDni}</p>
        <p style="margin-top: 0; margin-bottom: 0;"><strong>G.Do.:</strong> ${location.cualorg}</p>
        <p style="margin-top: 0; margin-bottom: 0;"><strong>Condicion:</strong> ${location.condicion}</p>
      </div>
    `;
    
      const popup = L.popup({ autoClose: false, closeOnClick: false })
        .setLatLng([location.lat, location.lng])
        .setContent(popupContent)
        .openOn(map);

      marker.bindPopup(popup);
      circle.bindPopup(popup);
    });
  }, [locations]);

  return (
    <div
      id="map"
      style={{
        height: isMapExpanded ? "100%" : "800px",
        width: "100%",
        position: isMapExpanded ? "absolute" : "relative",
        zIndex: isMapExpanded ? 9999 : 1,
        marginBottom: isMapExpanded ? "0" : "10px"
      }}
    >
      {isMapExpanded && (
  <button
    onClick={toggleMapExpand}
    className="fixed top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-lg opacity-40 hover:opacity-100 hover:bg-red-700"
    style={{ zIndex: 10000 }}
  >
    X
  </button>
)}
    </div>
  );
};

export default Mapa;