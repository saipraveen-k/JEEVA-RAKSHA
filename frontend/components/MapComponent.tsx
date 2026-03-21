'use client';

import { useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Loader2 } from 'lucide-react';
import { Case } from '@/types/case';

interface MapComponentProps {
  cases: Case[];
  loading?: boolean;
  mapType: 'roadmap' | 'satellite';
  showTraffic: boolean;
  className?: string;
}

const markerIcon = (priority: string) =>
  new L.Icon({
    iconUrl:
      priority === 'high'
        ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'
        : priority === 'low'
          ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png'
          : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const MapComponent = ({ cases, loading = false, mapType, showTraffic, className = '' }: MapComponentProps) => {
  const center = useMemo<[number, number]>(() => {
    if (cases.length === 0) return [20.5937, 78.9629]; // India center fallback
    const lat = cases.reduce((sum, c) => sum + c.location.lat, 0) / cases.length;
    const lng = cases.reduce((sum, c) => sum + c.location.lng, 0) / cases.length;
    return [lat, lng];
  }, [cases]);

  const tileUrl =
    mapType === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const attribution =
    mapType === 'satellite'
      ? '&copy; Esri, Maxar, Earthstar Geographics'
      : '&copy; OpenStreetMap contributors';

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      {showTraffic && (
        <div className="absolute bottom-4 right-4 z-[1000] bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-md shadow">
          Traffic overlay is not available in OSM mode
        </div>
      )}

      <MapContainer
        center={center}
        zoom={cases.length > 0 ? 11 : 5}
        scrollWheelZoom
        className="w-full h-full min-h-[400px] rounded-lg overflow-hidden"
      >
        <TileLayer attribution={attribution} url={tileUrl} />
        {cases.map((caseItem) => (
          <Marker
            key={caseItem._id}
            position={[caseItem.location.lat, caseItem.location.lng]}
            icon={markerIcon(caseItem.priority)}
          >
            <Popup>
              <div className="max-w-[240px]">
                <p className="font-semibold capitalize">{caseItem.animalType}</p>
                <p className="text-xs text-gray-600 mb-1">
                  {new Date(caseItem.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm mb-1">{caseItem.description}</p>
                <p className="text-xs">Status: {caseItem.status.replace('_', ' ')}</p>
                <p className="text-xs">Priority: {caseItem.priority}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
