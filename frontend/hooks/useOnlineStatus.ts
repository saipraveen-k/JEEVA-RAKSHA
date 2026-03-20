import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Wifi, WifiOff } from 'lucide-react';

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      console.log('Network connection restored');
      setIsOnline(true);
      setIsOffline(false);
      toast.success('Internet connection restored');
    };

    const handleOffline = () => {
      console.log('Network connection lost');
      setIsOnline(false);
      setIsOffline(true);
      toast.error('Internet connection lost. Some features may be unavailable.');
    };

    const handleConnectionChange = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      setIsOffline(!online);
      
      if (!online) {
        toast.error('No internet connection. Please check your network.');
      }
    };

    // Add event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      window.addEventListener('connectionchange', handleConnectionChange);
    }

    // Check initial status
    handleConnectionChange();

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('connectionchange', handleConnectionChange);
      }
    };
  }, []);

  // Periodic connection check (fallback)
  useEffect(() => {
    const checkConnection = () => {
      if (typeof navigator !== 'undefined') {
        const currentStatus = navigator.onLine;
        if (currentStatus !== isOnline) {
          setIsOnline(currentStatus);
          setIsOffline(!currentStatus);
          
          if (!currentStatus && !isOffline) {
            toast.error('Connection lost. Please check your internet.');
          } else if (currentStatus && isOffline) {
            toast.success('Connection restored.');
          }
        }
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, [isOnline, isOffline]);

  return {
    isOnline,
    isOffline,
    OnlineIcon: Wifi,
    OfflineIcon: WifiOff,
    statusText: isOnline ? 'Online' : 'Offline',
    statusColor: isOnline ? 'text-green-600' : 'text-red-600'
  };
};
