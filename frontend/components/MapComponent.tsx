'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/timeUtils';

interface MapLocation {
  _id: string;
  location: {
    lat: number;
    lng: number;
  };
  status: string;
  priority: string;
  animalType: string;
  createdAt?: string;
}

interface MapComponentProps {
  locations: MapLocation[];
  onLocationClick?: (location: MapLocation) => void;
}

export default function MapComponent({ locations, onLocationClick }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<MapLocation | null>(null);

  useEffect(() => {
    if (!mapRef.current || locations.length === 0) return;

    const mapElement = mapRef.current;
    mapElement.innerHTML = '';

    // Create enhanced map container
    const mapContainer = document.createElement('div');
    mapContainer.className = 'relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden';
    
    // Add grid pattern
    const gridOverlay = document.createElement('div');
    gridOverlay.className = 'absolute inset-0 opacity-20';
    gridOverlay.style.backgroundImage = `
      linear-gradient(to right, #e5e7eb 1px, transparent 1px),
      linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
    `;
    gridOverlay.style.backgroundSize = '50px 50px';
    mapContainer.appendChild(gridOverlay);

    // Add location markers
    locations.forEach((location, index) => {
      const marker = document.createElement('div');
      const angle = (index / locations.length) * 2 * Math.PI;
      const radius = Math.min(mapElement.offsetWidth, mapElement.offsetHeight) * 0.3;
      const x = 50 + (radius * Math.cos(angle)) / mapElement.offsetWidth * 100;
      const y = 50 + (radius * Math.sin(angle)) / mapElement.offsetHeight * 100;

      marker.className = cn(
        'absolute w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 z-10',
        location.priority === 'high' ? 'bg-red-500 shadow-lg animate-pulse' :
        location.priority === 'medium' ? 'bg-orange-500 shadow-md' :
        'bg-yellow-500 shadow-sm'
      );
      marker.style.left = `${x}%`;
      marker.style.top = `${y}%`;
      marker.textContent = location.animalType.charAt(0).toUpperCase();
      marker.title = `${location.animalType} - ${location.status}`;
      
      // Add tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 transition-opacity duration-200 pointer-events-none z-20 whitespace-nowrap';
      tooltip.innerHTML = `
        <div class="font-semibold">${location.animalType}</div>
        <div class="text-gray-300">${location.status}</div>
        ${location.createdAt ? `<div class="text-gray-400 text-xs">${formatRelativeTime(location.createdAt)}</div>` : ''}
      `;
      
      marker.appendChild(tooltip);
      
      // Hover effects
      marker.addEventListener('mouseenter', () => {
        setHoveredLocation(location);
        tooltip.classList.remove('opacity-0');
      });
      
      marker.addEventListener('mouseleave', () => {
        setHoveredLocation(null);
        tooltip.classList.add('opacity-0');
      });
      
      marker.addEventListener('click', () => {
        if (onLocationClick) {
          onLocationClick(location);
        }
        setSelectedLocation(location);
      });

      mapContainer.appendChild(marker);
    });

    // Add legend
    const legend = document.createElement('div');
    legend.className = 'absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3 text-xs z-30';
    legend.innerHTML = `
      <div class="font-semibold mb-2">Priority Levels</div>
      <div class="space-y-1">
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>High Priority</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span>Medium Priority</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Low Priority</span>
        </div>
      </div>
    `;

    mapContainer.appendChild(legend);
    mapElement.appendChild(mapContainer);

  }, [locations, onLocationClick]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center relative"
      style={{ minHeight: '400px' }}
    >
      {locations.length === 0 && (
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📍</div>
          <p>No cases to display on map</p>
          <p className="text-sm text-gray-400">Reported cases will appear here</p>
        </div>
      )}
      
      {selectedLocation && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 z-40 max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">{selectedLocation.animalType}</h4>
            <button 
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div><strong>Status:</strong> {selectedLocation.status}</div>
            <div><strong>Priority:</strong> {selectedLocation.priority}</div>
            {selectedLocation.createdAt && (
              <div><strong>Reported:</strong> {formatRelativeTime(selectedLocation.createdAt)}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
