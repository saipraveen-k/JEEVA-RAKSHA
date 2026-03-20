'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Case } from '@/types/case';

interface MapComponentProps {
  cases: Case[];
  loading?: boolean;
  mapType: 'roadmap' | 'satellite';
  showTraffic: boolean;
  className?: string;
}

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

const MapComponent = ({ cases, loading = false, mapType, showTraffic, className = '' }: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const trafficLayerRef = useRef<any>(null);
  
  const [mapLoading, setMapLoading] = useState(true);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  // Calculate center point from all cases
  const calculateCenter = useCallback((caseList: Case[]) => {
    if (caseList.length === 0) {
      return { lat: 40.7128, lng: -74.0060 }; // Default to NYC
    }

    const sumLat = caseList.reduce((sum, case_) => sum + case_.location.lat, 0);
    const sumLng = caseList.reduce((sum, case_) => sum + case_.location.lng, 0);
    
    return {
      lat: sumLat / caseList.length,
      lng: sumLng / caseList.length,
    };
  }, []);

  // Get marker color based on priority
  const getMarkerIcon = useCallback((priority: string) => {
    const colors = {
      high: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
      medium: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
      low: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  }, []);

  // Create info window content
  const createInfoWindowContent = useCallback((case_: Case) => {
    return `
      <div style="max-width: 250px; padding: 8px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">
          ${case_.animalType.charAt(0).toUpperCase() + case_.animalType.slice(1)}
        </h3>
        <div style="margin-bottom: 8px;">
          <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; background: ${
            case_.priority === 'high' ? '#ef4444' : 
            case_.priority === 'medium' ? '#f97316' : '#eab308'
          }; color: white;">
            ${case_.priority.toUpperCase()}
          </span>
        </div>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">
          ${case_.description}
        </p>
        <div style="margin-bottom: 4px;">
          <strong>Status:</strong> ${case_.status.replace('_', ' ')}
        </div>
        <div style="font-size: 12px; color: #999;">
          ${new Date(case_.createdAt).toLocaleDateString()}
        </div>
      </div>
    `;
  }, []);

  // Initialize map
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google || !window.google.maps) return;

    const center = calculateCenter(cases);
    const google = window.google;

    const map = new google.maps.Map(mapRef.current, {
      center: center,
      zoom: 13,
      mapTypeId: mapType === 'satellite' ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
      zoomControl: true,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
    });

    mapInstanceRef.current = map;
    setMapLoading(false);
  }, [cases, mapType, calculateCenter]);

  // Update markers when cases change
  const updateMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    cases.forEach((case_) => {
      const google = window.google;
      const marker = new google.maps.Marker({
        position: { lat: case_.location.lat, lng: case_.location.lng },
        map: mapInstanceRef.current,
        icon: getMarkerIcon(case_.priority),
        title: `${case_.animalType} - ${case_.priority}`,
        animation: google.maps.Animation.DROP,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(case_),
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });

    // Adjust map bounds to fit all markers
    if (cases.length > 0) {
      const google = window.google;
      const bounds = new google.maps.LatLngBounds();
      cases.forEach((case_) => {
        bounds.extend({ lat: case_.location.lat, lng: case_.location.lng });
      });
      mapInstanceRef.current.fitBounds(bounds);
      
      // Don't zoom in too far
      const listener = google.maps.event.addListener(mapInstanceRef.current, 'idle', () => {
        if (mapInstanceRef.current.getZoom() > 16) {
          mapInstanceRef.current.setZoom(16);
        }
        google.maps.event.removeListener(listener);
      });
    }
  }, [cases, getMarkerIcon, createInfoWindowContent]);

  // Update traffic layer
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;

    if (showTraffic) {
      if (!trafficLayerRef.current) {
        trafficLayerRef.current = new window.google.maps.TrafficLayer();
      }
      trafficLayerRef.current.setMap(mapInstanceRef.current);
    } else {
      if (trafficLayerRef.current) {
        trafficLayerRef.current.setMap(null);
      }
    }
  }, [showTraffic]);

  // Update map type
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;

    const google = window.google;
    const newMapTypeId = mapType === 'satellite' ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.ROADMAP;
    mapInstanceRef.current.setMapTypeId(newMapTypeId);
  }, [mapType]);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setGoogleMapsLoaded(true);
        return;
      }

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey || apiKey === 'YOUR_API_KEY') {
        console.warn('Google Maps API key not configured. Map features will be limited.');
        setGoogleMapsLoaded(false);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      
      window.initGoogleMaps = () => {
        setGoogleMapsLoaded(true);
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (googleMapsLoaded && mapRef.current) {
      initializeMap();
    }
  }, [googleMapsLoaded, initializeMap]);

  // Update markers when cases change
  useEffect(() => {
    if (mapInstanceRef.current && !loading && googleMapsLoaded) {
      updateMarkers();
    }
  }, [cases, loading, updateMarkers, googleMapsLoaded]);

  return (
    <div className={`relative ${className}`}>
      {/* Loading State */}
      {(loading || mapLoading) && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full min-h-[400px] rounded-lg overflow-hidden"
        style={{ backgroundColor: '#f3f4f6' }}
      />

      {/* API Key Notice */}
      {!googleMapsLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-center p-6">
            <div className="w-12 h-12 mx-auto mb-4 text-gray-400 flex items-center justify-center">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Google Maps API Required</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add your Google Maps API key to enable the map feature.
            </p>
            <div className="bg-gray-800 text-green-400 p-3 rounded-lg text-sm font-mono">
              Replace "YOUR_API_KEY" in MapComponent.tsx
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
