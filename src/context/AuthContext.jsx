import React, { createContext, useEffect, useMemo, useState } from 'react';
import http from '../services/http';

export const AuthContext = createContext(null);

function readStoredAuth() {
  try {
    const raw = window.localStorage.getItem('smartleave_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedUser = readStoredAuth();
    const storedToken = window.localStorage.getItem('smartleave_token');
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setReady(true);
  }, []);

  const persistAuth = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    window.localStorage.setItem('smartleave_user', JSON.stringify(nextUser));
    window.localStorage.setItem('smartleave_token', nextToken);
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    window.localStorage.removeItem('smartleave_user');
    window.localStorage.removeItem('smartleave_token');
  };

  const login = async (email, password) => {
    const { data } = await http.post('/api/auth/login', { email, password });
    persistAuth(
      {
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
        leaveBalance: data.leaveBalance,
      },
      data.token,
    );
    return data;
  };

  const register = async (payload) => {
    const { data } = await http.post('/api/auth/register', payload);
    persistAuth(
      {
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
        leaveBalance: data.leaveBalance,
      },
      data.token,
    );
    return data;
  };

  const value = useMemo(
    () => ({
      ready,
      user,
      token,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout: clearAuth,
    }),
    [ready, user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}