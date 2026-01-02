'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '../types';
import { apiLogin, apiRegister, apiUpdateUser } from '../services/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Only access localStorage on client mount
    const storedUserStr = localStorage.getItem('mentalsense_current_user');
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        setUser(storedUser);
      } catch (e) {
        console.error("Erreur lecture user storage", e);
        localStorage.removeItem('mentalsense_current_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const u = await apiLogin(email, pass);
      setUser(u);
      localStorage.setItem('mentalsense_current_user', JSON.stringify(u));
    } catch (e) {
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      const u = await apiRegister(name, email, pass);
      setUser(u);
      localStorage.setItem('mentalsense_current_user', JSON.stringify(u));
    } catch (e) {
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPrefs = async (updates: Partial<User>) => {
    if (!user) return;
    try {
      const newUser = { ...user, ...updates };
      setUser(newUser);
      localStorage.setItem('mentalsense_current_user', JSON.stringify(newUser));
      await apiUpdateUser(user.id, updates);
    } catch (e) {
      console.error("Failed to update user prefs API", e);
    }
  };

  const logout = () => {
    localStorage.removeItem('mentalsense_current_user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateUserPrefs, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return context;
};