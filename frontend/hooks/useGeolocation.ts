'use client';

import { useState, useEffect, useCallback } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface GeolocationState {
  location: Location | null;
  loading: boolean;
  error: string | null;
  accuracy: number | null;
}

interface UseGeolocationReturn extends GeolocationState {
  fetchLocation: () => Promise<void>;
  clearLocation: () => void;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
    accuracy: null,
  });

  const fetchLocation = useCallback(async () => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      });

      const { latitude, longitude, accuracy } = position.coords;

      setState({
        location: { lat: latitude, lng: longitude },
        loading: false,
        error: null,
        accuracy: accuracy,
      });

      console.log('📍 Location fetched successfully:', {
        lat: latitude,
        lng: longitude,
        accuracy: `${accuracy.toFixed(2)}m`,
      });
    } catch (error) {
      let errorMessage = 'Unable to fetch your location';
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable GPS in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = 'An unknown error occurred while fetching location.';
        }
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      console.error('❌ Geolocation error:', error);
    }
  }, []);

  const clearLocation = useCallback(() => {
    setState({
      location: null,
      loading: false,
      error: null,
      accuracy: null,
    });
  }, []);

  // Auto-fetch location on mount
  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return {
    ...state,
    fetchLocation,
    clearLocation,
  };
};
