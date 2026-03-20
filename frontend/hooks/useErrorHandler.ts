import { useCallback } from 'react';
import toast from 'react-hot-toast';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown, context: string = 'operation') => {
    console.error(`Error in ${context}:`, error);

    if (error instanceof Error) {
      // Handle network errors
      if (error.message.includes('fetch') || error.message.includes('network')) {
        toast.error('Network error. Please check your internet connection and try again.');
        return;
      }

      // Handle specific error messages
      if (error.message.includes('token') || error.message.includes('auth')) {
        toast.error('Authentication failed. Please log in again.');
        // Clear auth state and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
        return;
      }

      if (error.message.includes('not found') || error.message.includes('404')) {
        toast.error('Resource not found.');
        return;
      }

      if (error.message.includes('forbidden') || error.message.includes('403')) {
        toast.error('Access denied. You do not have permission to perform this action.');
        return;
      }

      if (error.message.includes('unauthorized') || error.message.includes('401')) {
        toast.error('Unauthorized access. Please log in.');
        return;
      }

      // Generic error message
      toast.error(error.message || `Failed to complete ${context}.`);
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      // Handle API error responses
      const apiError = error as ApiError;
      toast.error(apiError.message || `Failed to complete ${context}.`);
    } else {
      // Handle unknown errors
      toast.error(`An unexpected error occurred during ${context}. Please try again.`);
    }
  }, []);

  const handleApiError = useCallback((error: unknown, context: string = 'API request') => {
    console.error(`API Error in ${context}:`, error);

    if (typeof error === 'object' && error !== null) {
      const errorObj = error as any;
      
      // Handle axios errors
      if (errorObj.response) {
        const status = errorObj.response.status;
        const message = errorObj.response.data?.message || errorObj.response.statusText;

        switch (status) {
          case 400:
            toast.error(message || 'Invalid request. Please check your input.');
            break;
          case 401:
            toast.error('Authentication failed. Please log in again.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
            break;
          case 403:
            toast.error('Access denied. You do not have permission to perform this action.');
            break;
          case 404:
            toast.error('Resource not found.');
            break;
          case 409:
            toast.error(message || 'Conflict: This resource already exists or is in use.');
            break;
          case 422:
            toast.error(message || 'Validation error. Please check your input.');
            break;
          case 500:
            toast.error('Server error. Please try again later.');
            break;
          case 502:
          case 503:
          case 504:
            toast.error('Service temporarily unavailable. Please try again later.');
            break;
          default:
            toast.error(message || `Server error (${status}). Please try again later.`);
        }
      } else if (errorObj.request) {
        // Network error
        toast.error('Network error. Please check your internet connection and try again.');
      } else {
        // Other error
        toast.error(errorObj.message || `Failed to complete ${context}.`);
      }
    } else {
      toast.error(`An unexpected error occurred during ${context}. Please try again.`);
    }
  }, []);

  const handleValidationErrors = useCallback((errors: Record<string, string[]>) => {
    Object.entries(errors).forEach(([field, messages]) => {
      messages.forEach(message => {
        toast.error(`${field}: ${message}`);
      });
    });
  }, []);

  return {
    handleError,
    handleApiError,
    handleValidationErrors
  };
};