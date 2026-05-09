import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { loginUser, logoutUser, fetchCurrentUser, AuthResponse, registerUser } from '@/controllers/api';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  login: (credentials?: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        try {
          const userData = await fetchCurrentUser(storedToken);
          setToken(storedToken);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to restore auth session:', error);
          logout(); // Clear invalid token
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials?: any) => {
    try {
      if (!credentials) {
        setIsAuthenticated(true);
        return;
      }
      const response = await loginUser(credentials);
      const { access_token, user } = response;
      
      localStorage.setItem('auth_token', access_token);
      setToken(access_token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (data: any) => {
    try {
      const response = await registerUser(data);
      const { access_token, user } = response;
      
      localStorage.setItem('auth_token', access_token);
      setToken(access_token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await logoutUser(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [token]);

  const value = useMemo(() => ({
    isAuthenticated,
    user,
    token,
    login,
    register,
    logout,
    isLoading
  }), [isAuthenticated, user, token, login, register, logout, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
