'use client';
// src/hooks/useAuth.tsx
// Auth context: stores user, token, language preference

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '@/lib/api';
import type { Lang } from '@/lib/i18n';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  preferred_language: Lang;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  lang: Lang;
  setLang: (l: Lang) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: object) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLangState] = useState<Lang>('en');
  const [loading, setLoading] = useState(true);

  // Restore session from cookie
  useEffect(() => {
    const token = Cookies.get('hostai_token');
    const saved = Cookies.get('hostai_user');
    if (token && saved) {
      try {
        const u = JSON.parse(saved);
        setUser(u);
        setLangState(u.preferred_language || 'en');
      } catch {}
    }
    setLoading(false);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (user) {
      authAPI.updateProfile({ ...user, preferred_language: l }).catch(() => {});
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    const { token, user: u } = res.data;
    Cookies.set('hostai_token', token, { expires: 7 });
    Cookies.set('hostai_user', JSON.stringify(u), { expires: 7 });
    setUser(u);
    setLangState(u.preferred_language || 'en');
  }, []);

  const register = useCallback(async (data: object) => {
    const res = await authAPI.register(data);
    const { token, user: u } = res.data;
    Cookies.set('hostai_token', token, { expires: 7 });
    Cookies.set('hostai_user', JSON.stringify(u), { expires: 7 });
    setUser(u);
    setLangState((u as User).preferred_language || 'en');
  }, []);

  const logout = useCallback(() => {
    Cookies.remove('hostai_token');
    Cookies.remove('hostai_user');
    setUser(null);
    window.location.href = '/auth/login';
  }, []);

  return (
    <AuthContext.Provider value={{ user, lang, setLang, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
