const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  // Auth endpoints
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  register: async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  },

  getCurrentUser: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Case endpoints
  getCases: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/cases`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getCase: async (token: string, id: string) => {
    const response = await fetch(`${API_BASE_URL}/cases/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  createCase: async (token: string, caseData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/cases`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: caseData,
    });
    return response.json();
  },

  updateCase: async (token: string, id: string, updates: any) => {
    const response = await fetch(`${API_BASE_URL}/cases/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  deleteCase: async (token: string, id: string) => {
    const response = await fetch(`${API_BASE_URL}/cases/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getMapLocations: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/cases/map/locations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // User endpoints
  getUsers: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getUserStats: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/users/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};
