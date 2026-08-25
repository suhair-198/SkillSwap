import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserDTO } from '../services/types';
import { api } from '../services/api';
import { wsService } from '../services/websocket';

interface AuthContextType {
  user: UserDTO | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password:  string; fullName: string; college?: string; department?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<UserDTO>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const userData = await api.auth.me();
          setUser(userData);
          setToken(storedToken);
          // Connect WebSockets
          wsService.connect();
          // Notify online
          setTimeout(() => {
            wsService.sendStatusUpdate(userData.id, true);
          }, 1000);
        } catch (err) {
          console.error('Session validation failed', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
    return () => {
      wsService.disconnect();
    };
  }, []);

  const login = async (email: string, password:  string) => {
    setLoading(true);
    try {
      const response = await api.auth.login({ email, password });
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setToken(response.token);
      wsService.connect();
      setTimeout(() => {
        wsService.sendStatusUpdate(response.user.id, true);
      }, 1000);
    } catch (err) {
      setLoading(false);
      throw err;
    }
    setLoading(false);
  };

  const register = async (data: { email: string; password:  string; fullName: string; college?: string; department?: string }) => {
    setLoading(true);
    try {
      const response = await api.auth.register(data);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setToken(response.token);
      wsService.connect();
      setTimeout(() => {
        wsService.sendStatusUpdate(response.user.id, true);
      }, 1000);
    } catch (err) {
      setLoading(false);
      throw err;
    }
    setLoading(false);
  };

  const logout = () => {
    if (user) {
      wsService.sendStatusUpdate(user.id, false);
    }
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    wsService.disconnect();
  };

  const refreshUser = async () => {
    try {
      const userData = await api.auth.me();
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Failed to refresh user', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
