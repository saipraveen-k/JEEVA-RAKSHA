import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

interface UseRealtimeUpdatesOptions {
  enabled?: boolean;
  onNewCase?: (caseData: unknown) => void;
  onCaseUpdated?: (caseData: unknown) => void;
  onCaseDeleted?: (caseId: string) => void;
}

export const useRealtimeUpdates = ({ 
  enabled = true, 
  onNewCase, 
  onCaseUpdated, 
  onCaseDeleted 
}: UseRealtimeUpdatesOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled) return;

    // Only initialize socket if not already connected
    if (!socketRef.current) {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setConnectionError('No authentication token found');
        return;
      }

      // Dynamically import socket.io-client to avoid SSR issues
      import('socket.io-client').then(({ default: io }) => {
        try {
          const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000', {
            auth: {
              token: token
            },
            transports: ['websocket', 'polling']
          });

          socket.on('connect', () => {
            setIsConnected(true);
            setConnectionError(null);
            socket.emit('join-admin-room');
            console.log('Connected to admin room');
          });

          socket.on('disconnect', () => {
            setIsConnected(false);
            console.log('Disconnected from admin room');
          });

          socket.on('connect_error', (error: unknown) => {
            setIsConnected(false);
            const errorMessage = error instanceof Error ? error.message : 'Connection failed';
            setConnectionError(errorMessage);
            console.error('Socket connection error:', error);
            toast.error('Real-time updates unavailable');
          });

          // Handle real-time events
          socket.on('new-case', (caseData: unknown) => {
            console.log('New case received:', caseData);
            toast.success('New case reported!');
            if (onNewCase) onNewCase(caseData);
          });

          socket.on('case-updated', (caseData: unknown) => {
            console.log('Case updated:', caseData);
            toast.success('Case status updated!');
            if (onCaseUpdated) onCaseUpdated(caseData);
          });

          socket.on('case-deleted', (caseId: string) => {
            console.log('Case deleted:', caseId);
            toast.success('Case deleted!');
            if (onCaseDeleted) onCaseDeleted(caseId);
          });

          socketRef.current = socket;

        } catch (error) {
          console.error('Failed to initialize socket:', error);
          setConnectionError('Failed to initialize real-time connection');
        }
      }).catch((error) => {
        console.error('Socket.io client not available:', error);
        setConnectionError('Real-time updates not available');
      });
    }

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [enabled, onNewCase, onCaseUpdated, onCaseDeleted]);

  return {
    isConnected,
    connectionError,
    reconnect: () => {
      if (socketRef.current) {
        socketRef.current.connect();
      }
    }
  };
};
