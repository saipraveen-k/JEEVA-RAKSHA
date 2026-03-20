import { useCallback } from 'react';
import Swal from 'sweetalert2';

export const useSweetAlert = () => {
  const showSuccess = useCallback((title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#10b981',
      background: '#ffffff',
      color: '#1f2937',
      customClass: {
        popup: 'rounded-lg shadow-xl',
        confirmButton: 'px-4 py-2 rounded-md font-medium'
      },
      timer: 2000,
      timerProgressBar: true
    });
  }, []);

  const showError = useCallback((title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#ef4444',
      background: '#ffffff',
      color: '#1f2937',
      customClass: {
        popup: 'rounded-lg shadow-xl',
        confirmButton: 'px-4 py-2 rounded-md font-medium'
      }
    });
  }, []);

  const showWarning = useCallback((title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonText: 'OK',
      confirmButtonColor: '#f59e0b',
      background: '#ffffff',
      color: '#1f2937',
      customClass: {
        popup: 'rounded-lg shadow-xl',
        confirmButton: 'px-4 py-2 rounded-md font-medium'
      }
    });
  }, []);

  const showInfo = useCallback((title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6',
      background: '#ffffff',
      color: '#1f2937',
      customClass: {
        popup: 'rounded-lg shadow-xl',
        confirmButton: 'px-4 py-2 rounded-md font-medium'
      }
    });
  }, []);

  const confirmAction = useCallback(async (title: string, text?: string, confirmText: string = 'Yes', cancelText: string = 'Cancel') => {
    return await Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      background: '#ffffff',
      color: '#1f2937',
      customClass: {
        popup: 'rounded-lg shadow-xl',
        confirmButton: 'px-4 py-2 rounded-md font-medium',
        cancelButton: 'px-4 py-2 rounded-md font-medium'
      }
    });
  }, []);

  const confirmStartWorking = useCallback(async () => {
    return await confirmAction(
      'Start Working on Case?',
      'This case will be assigned to you and marked as in progress.',
      'Start Working',
      'Cancel'
    );
  }, [confirmAction]);

  const confirmMarkResolved = useCallback(async () => {
    return await confirmAction(
      'Mark Case as Resolved?',
      'This case will be marked as resolved and removed from active cases.',
      'Mark Resolved',
      'Cancel'
    );
  }, [confirmAction]);

  const confirmDeleteCase = useCallback(async () => {
    return await confirmAction(
      'Delete Case?',
      'This action cannot be undone. Are you sure you want to delete this case?',
      'Delete',
      'Cancel'
    );
  }, [confirmAction]);

  const showLoading = useCallback((title?: string) => {
    Swal.fire({
      title: title || 'Processing...',
      allowOutsideClick: false,
      showConfirmButton: false,
      background: 'rgba(255, 255, 255, 0.9)',
      backdrop: 'rgba(0, 0, 0, 0.4)',
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }, []);

  const closeLoading = useCallback(() => {
    Swal.close();
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    confirmAction,
    confirmStartWorking,
    confirmMarkResolved,
    confirmDeleteCase,
    showLoading,
    closeLoading
  };
};