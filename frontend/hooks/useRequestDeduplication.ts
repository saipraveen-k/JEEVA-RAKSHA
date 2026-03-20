import { useRef, useCallback } from 'react';

interface PendingRequest {
  promise: Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

export const useRequestDeduplication = () => {
  const pendingRequests = useRef<Map<string, PendingRequest>>(new Map());

  const deduplicateRequest = useCallback(async (key: string, requestFn: () => Promise<any>) => {
    // Check if request is already pending
    if (pendingRequests.current.has(key)) {
      console.log(`Request already pending: ${key}`);
      return pendingRequests.current.get(key)!.promise;
    }

    // Create new request
    const promise = new Promise<any>((resolve, reject) => {
      // Store in pending map with resolve and reject functions
      pendingRequests.current.set(key, {
        promise,
        resolve,
        reject
      });
    });

    try {
      const result = await requestFn();
      // Get the stored request and resolve it
      const storedRequest = pendingRequests.current.get(key);
      if (storedRequest) {
        storedRequest.resolve(result);
      }
      return result;
    } catch (error) {
      // Get the stored request and reject it
      const storedRequest = pendingRequests.current.get(key);
      if (storedRequest) {
        storedRequest.reject(error);
      }
      throw error;
    } finally {
      // Clean up after request completes
      pendingRequests.current.delete(key);
    }
  }, []);

  const clearPendingRequest = useCallback((key: string) => {
    if (pendingRequests.current.has(key)) {
      const request = pendingRequests.current.get(key);
      if (request) {
        request.reject(new Error('Request cancelled'));
      }
      pendingRequests.current.delete(key);
    }
  }, []);

  const clearAllPendingRequests = useCallback(() => {
    pendingRequests.current.forEach((request, key) => {
      request.reject(new Error('All requests cancelled'));
    });
    pendingRequests.current.clear();
  }, []);

  const getPendingRequests = useCallback(() => {
    return Array.from(pendingRequests.current.keys());
  }, []);

  const isRequestPending = useCallback((key: string) => {
    return pendingRequests.current.has(key);
  }, []);

  return {
    deduplicateRequest,
    clearPendingRequest,
    clearAllPendingRequests,
    getPendingRequests,
    isRequestPending
  };
};
