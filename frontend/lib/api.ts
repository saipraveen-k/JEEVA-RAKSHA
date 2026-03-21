import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🌐 API ERROR:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message,
      timestamp: new Date().toISOString()
    });
    
    if (error.response?.status === 401) {
      const isLoginEndpoint = error.config?.url?.includes('/auth/login');
      if (!isLoginEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth endpoints
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user');
    }
  },

  // Case endpoints
  getCases: async () => {
    try {
      const response = await api.get('/cases');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch cases');
    }
  },

  getCase: async (id: string) => {
    try {
      const response = await api.get(`/cases/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch case');
    }
  },

  createCase: async (caseData: FormData) => {
    try {
      const response = await api.post('/cases', caseData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create case');
    }
  },

  updateCase: async (id: string, updates: any) => {
    try {
      const response = await api.put(`/cases/${id}`, updates);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update case');
    }
  },

  deleteCase: async (id: string) => {
    try {
      const response = await api.delete(`/cases/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete case');
    }
  },

  getMapLocations: async () => {
    try {
      const response = await api.get('/cases/map/locations');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch map locations');
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/cases/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stats');
    }
  },

  // User endpoints
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  getUserStats: async () => {
    try {
      const response = await api.get('/users/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user stats');
    }
  },
};