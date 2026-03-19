'use client';

import { useEffect, useRef } from 'react';

interface MapLocation {
  _id: string;
  location: {
    lat: number;
    lng: number;
  };
  status: string;
  priority: string;
  animalType: string;
}

interface MapComponentProps {
  locations: MapLocation[];
  onLocationClick?: (location: MapLocation) => void;
}

export default function MapComponent({ locations, onLocationClick }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || locations.length === 0) return;

    // Simple map visualization using HTML/CSS
    // In a real implementation, you would use Mapbox or Google Maps
    const mapElement = mapRef.current;
    mapElement.innerHTML = '';

    // Create a simple grid-based map
    const mapContainer = document.createElement('div');
    mapContainer.className = 'relative w-full h-full bg-blue-50 rounded-lg overflow-hidden';
    
    // Add grid lines for visual effect
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
      marker.className = 'absolute w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110';
      
      // Color based on priority
      if (location.priority === 'high') {
        marker.className += ' bg-red-500';
      } else if (location.priority === 'medium') {
        marker.className += ' bg-orange-500';
      } else {
        marker.className += ' bg-yellow-500';
      }

      // Position markers in a distributed pattern
      const angle = (index / locations.length) * 2 * Math.PI;
      const radius = Math.min(mapElement.offsetWidth, mapElement.offsetHeight) * 0.3;
      const x = 50 + (radius * Math.cos(angle)) / mapElement.offsetWidth * 100;
      const y = 50 + (radius * Math.sin(angle)) / mapElement.offsetHeight * 100;
      
      marker.style.left = `${x}%`;
      marker.style.top = `${y}%`;
      marker.textContent = location.animalType.charAt(0).toUpperCase();
      marker.title = `${location.animalType} - ${location.status}`;
      
      marker.addEventListener('click', () => {
        if (onLocationClick) {
          onLocationClick(location);
        }
      });

      // Add pulse animation for high priority
      if (location.priority === 'high') {
        const pulse = document.createElement('div');
        pulse.className = 'absolute inset-0 rounded-full bg-red-500 animate-ping';
        marker.appendChild(pulse);
        
        const icon = document.createElement('span');
        icon.className = 'relative z-10';
        icon.textContent = location.animalType.charAt(0).toUpperCase();
        marker.appendChild(icon);
      }

      mapContainer.appendChild(marker);
    });

    // Add legend
    const legend = document.createElement('div');
    legend.className = 'absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3 text-xs';
    legend.innerHTML = `
      <div class="font-semibold mb-2">Priority Levels</div>
      <div class="flex items-center space-x-2 mb-1">
        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
        <span>High Priority</span>
      </div>
      <div class="flex items-center space-x-2 mb-1">
        <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
        <span>Medium Priority</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <span>Low Priority</span>
      </div>
    `;
    mapContainer.appendChild(legend);

    mapElement.appendChild(mapContainer);
  }, [locations, onLocationClick]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center"
      style={{ minHeight: '400px' }}
    >
      {locations.length === 0 && (
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📍</div>
          <p>No cases to display on map</p>
        </div>
      )}
    </div>
  );
}
