import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiService } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  points?: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        await apiService.getCurrentUser();
        setUser(parsedUser);
      } catch (error) {
        console.error('Token invalid:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
    setAuthChecked(true);
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiService.login(email, password);

      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        
        toast.success(`Welcome back, ${response.user.name}!`);

        return { success: true, user: response.user };
      } else {
        toast.error(response.message || 'Login failed');
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      toast.error(error.message || 'Network error. Please try again.');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiService.register(name, email, password);

      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        
        // Redirect handled by login page
        return { success: true, user: response.user };
      } else {
        toast.error(response.message || 'Registration failed');
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      toast.error(error.message || 'Network error. Please try again.');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = (showMessage = true) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAuthChecked(false);
    router.push('/');
    if (showMessage) {
      toast.success('Logged out successfully');
    }
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user && authChecked;

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    authChecked,
    login,
    register,
    logout,
    checkAuth,
  };
};