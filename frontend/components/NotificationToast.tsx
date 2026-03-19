'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Bell, CheckCircle, AlertTriangle } from 'lucide-react';

interface NotificationToastProps {
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export function showNotification({ type, title, message, duration = 5000 }: NotificationToastProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertTriangle className="w-5 h-5 text-red-500" />,
    info: <Bell className="w-5 h-5 text-blue-500" />
  };

  const toastOptions = {
    duration,
    position: 'top-right' as const,
    icon: icons[type],
    style: {
      background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
      border: 'none',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  };

  toast(
    <div className="flex items-start space-x-3">
      <div className="flex-1">
        <div className="font-semibold text-white">{title}</div>
        <div className="text-sm text-white/90">{message}</div>
      </div>
    </div>,
    toastOptions
  );
}

// Hook for showing real-time notifications
export function useRealTimeNotifications() {
  useEffect(() => {
    // Listen for custom events from real-time updates
    const handleNewCase = (event: CustomEvent) => {
      showNotification({
        type: 'info',
        title: '🐾 New Case Reported',
        message: `A new ${event.detail.animalType} case has been reported!`,
      });
    };

    const handleCaseUpdate = (event: CustomEvent) => {
      showNotification({
        type: 'success',
        title: '✅ Case Updated',
        message: `Case status changed to ${event.detail.status}`,
      });
    };

    window.addEventListener('new-case', handleNewCase as EventListener);
    window.addEventListener('case-updated', handleCaseUpdate as EventListener);

    return () => {
      window.removeEventListener('new-case', handleNewCase as EventListener);
      window.removeEventListener('case-updated', handleCaseUpdate as EventListener);
    };
  }, []);
}
