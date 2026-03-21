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

    if (!window.isSecureContext) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Location requires a secure context (localhost/https). Please open the app directly in your browser.',
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const getPosition = (options: PositionOptions) =>
        new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });

      let position: GeolocationPosition;
      try {
        position = await getPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      } catch {
        // Fallback mode for devices/browsers that time out with high accuracy enabled.
        position = await getPosition({
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 60000,
        });
      }

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
            errorMessage = 'Location access denied. Allow location permission for localhost and retry.';
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
