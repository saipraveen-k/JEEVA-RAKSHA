import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

interface RealtimeUpdatesProps {
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
}: RealtimeUpdatesProps = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<any>(null);
  
  // Use refs to store the latest callback functions
  const callbacksRef = useRef({
    onNewCase,
    onCaseUpdated,
    onCaseDeleted
  });
  
  // Update refs when callbacks change
  useEffect(() => {
    callbacksRef.current = {
      onNewCase,
      onCaseUpdated,
      onCaseDeleted
    };
  }, [onNewCase, onCaseUpdated, onCaseDeleted]);

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
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const socket = io(apiUrl.replace('/api', ''), {
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

          // Handle real-time events using refs to get latest callbacks
          socket.on('new-case', (caseData: unknown) => {
            console.log('New case received:', caseData);
            toast.success('New case reported!');
            if (callbacksRef.current.onNewCase) callbacksRef.current.onNewCase(caseData);
          });

          socket.on('case-updated', (caseData: unknown) => {
            console.log('Case updated:', caseData);
            toast.success('Case status updated!');
            if (callbacksRef.current.onCaseUpdated) callbacksRef.current.onCaseUpdated(caseData);
          });

          socket.on('case-deleted', (caseId: string) => {
            console.log('Case deleted:', caseId);
            toast.success('Case deleted!');
            if (callbacksRef.current.onCaseDeleted) callbacksRef.current.onCaseDeleted(caseId);
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

    // Cleanup function - CRITICAL for preventing memory leaks
    return () => {
      if (socketRef.current) {
        console.log('Cleaning up socket connection');
        socketRef.current.removeAllListeners(); // Remove all event listeners
        socketRef.current.disconnect(); // Disconnect socket
        socketRef.current = null; // Clear reference
        setIsConnected(false);
        setConnectionError(null);
      }
    };
  }, [enabled]);

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
