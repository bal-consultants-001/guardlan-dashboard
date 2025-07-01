'use client';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function ServiceAreaMap() {
  const center: [number, number] = [51.4098, -3.4828]; // CF61 1UW approx
  const radiusInMeters = 32187; // ~20 miles

  return (
    <MapContainer center={center} zoom={10} scrollWheelZoom={false} style={{ height: '480px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center}>
        <Popup>CF61 1UW</Popup>
      </Marker>
      <Circle center={center} radius={radiusInMeters} pathOptions={{ color: 'blue', fillOpacity: 0.2 }} />
    </MapContainer>
  );
}
