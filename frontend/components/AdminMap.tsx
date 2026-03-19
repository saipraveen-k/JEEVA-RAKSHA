'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, MapPin, Layers, Navigation } from 'lucide-react';
import { Case } from '@/types/case';

interface AdminMapProps {
  cases: Case[];
  loading?: boolean;
  className?: string;
}

// Dynamic import to avoid SSR issues
const MapComponent = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-gray-100 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }
);

const AdminMap = ({ cases, loading = false, className = '' }: AdminMapProps) => {
  const [showTraffic, setShowTraffic] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  // Toggle satellite view
  const toggleSatellite = useCallback(() => {
    setMapType(prev => prev === 'roadmap' ? 'satellite' : 'roadmap');
  }, []);

  // Toggle traffic layer
  const toggleTraffic = useCallback(() => {
    setShowTraffic(prev => !prev);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        {/* Satellite Toggle */}
        <button
          onClick={toggleSatellite}
          className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Toggle Satellite View"
        >
          <Layers className="w-4 h-4" />
          <span className="text-sm font-medium">
            {mapType === 'satellite' ? 'Roadmap' : 'Satellite'}
          </span>
        </button>

        {/* Traffic Toggle */}
        <button
          onClick={toggleTraffic}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-md transition-colors ${
            showTraffic 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-white hover:bg-gray-50'
          }`}
          title="Toggle Traffic Layer"
        >
          <Navigation className="w-4 h-4" />
          <span className="text-sm font-medium">Traffic</span>
        </button>
      </div>

      {/* Case Count Badge */}
      <div className="absolute top-4 left-4 z-10 bg-white px-3 py-2 rounded-lg shadow-md">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium">
            {cases.length} {cases.length === 1 ? 'Case' : 'Cases'}
          </span>
        </div>
      </div>

      {/* Priority Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white px-3 py-2 rounded-lg shadow-md">
        <div className="text-xs font-medium mb-1">Priority</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs">High</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-xs">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs">Low</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <MapComponent 
        cases={cases} 
        loading={loading}
        mapType={mapType}
        showTraffic={showTraffic}
        className="w-full h-full min-h-[400px]"
      />
    </div>
  );
};

export default AdminMap;
