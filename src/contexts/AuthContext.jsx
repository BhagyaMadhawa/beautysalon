import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api('/api/auth/me');
      setUser(response.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      if (response?.token) {
        localStorage.setItem('token', response.token);
      }

      // Update user state after successful login
      setUser(response.user); // Set user directly from the login response

      // Check user role and redirect accordingly
      const redirectPath = response.user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      
      // Refresh the page to update navbar and redirect to appropriate dashboard
      window.location.href = redirectPath;
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await api('/api/auth/signup', {
        method: 'POST',
        body: userData,
      });

      
      if (response?.token) {
        localStorage.setItem('token', response.token);
      }

      // Update user state after successful login
      setUser(response.user); // Set user directly from the login response

      // Check user role and redirect accordingly
      const redirectPath = response.user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      
      // Refresh the page to update navbar and redirect to appropriate dashboard
      window.location.href = redirectPath;
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setUser(null);
      // Redirect to home page after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
