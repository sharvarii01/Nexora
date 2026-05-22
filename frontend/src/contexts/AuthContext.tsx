'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  _id: string; name: string; email: string; avatar: string;
  targetRole: string; targetCompanies: string[]; college: string;
  branch: string; graduationYear: number; skills: string[];
  points: number; streak: number; placementStatus: string;
  resumeAnalysis: Record<string, unknown> | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Record<string, string>) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('nexora_token');
    const stored = localStorage.getItem('nexora_user');
    if (token && stored) {
      setUser(JSON.parse(stored));
      api.get('/auth/me')
        .then(r => {
          setUser(r.data.user);
          localStorage.setItem('nexora_user', JSON.stringify(r.data.user));
          localStorage.setItem('nexora_last_user', JSON.stringify(r.data.user));
        })
        .catch((err) => {
          if (err.response?.status === 401) logout();
        });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('nexora_token', data.token);
    localStorage.setItem('nexora_user', JSON.stringify(data.user));
    localStorage.setItem('nexora_last_user', JSON.stringify(data.user));
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.name}! 🚀`);
  };

  const register = async (formData: Record<string, string>) => {
    const { data } = await api.post('/auth/register', formData);
    localStorage.setItem('nexora_token', data.token);
    localStorage.setItem('nexora_user', JSON.stringify(data.user));
    localStorage.setItem('nexora_last_user', JSON.stringify(data.user));
    setUser(data.user);
    toast.success('Account created! Your journey starts now 🎯');
  };

  const logout = () => {
    localStorage.removeItem('nexora_token');
    localStorage.removeItem('nexora_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
