import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: Role | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: Role) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  switchDemoUser: (targetRole: Role) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('fitpulse_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  const fetchCurrentUser = async () => {
    try {
      if (!localStorage.getItem('fitpulse_token')) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const res = await api.getMe();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.success) {
        localStorage.setItem('fitpulse_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        showToast(`Welcome back, ${res.data.user.name}!`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Login failed. Please verify credentials.', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: Role = 'USER') => {
    setIsLoading(true);
    try {
      const res = await api.register({ name, email, password, role });
      if (res.success) {
        localStorage.setItem('fitpulse_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        showToast('Registration successful! Welcome to FitPulse.', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Registration failed.', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('fitpulse_token');
    setToken(null);
    setUser(null);
    showToast('You have been safely signed out.', 'info');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  // Instant 1-click switch for effortless Admin / Athlete testing
  const switchDemoUser = async (targetRole: Role) => {
    const creds =
      targetRole === 'ADMIN'
        ? { email: 'admin@fitpulse.com', password: 'Admin123!' }
        : { email: 'sarah@fitpulse.com', password: 'User123!' };
    try {
      await login(creds.email, creds.password);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: (user?.role as Role) || null,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
