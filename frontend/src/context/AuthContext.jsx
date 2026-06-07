import React, { createContext, useState, useEffect } from 'react';
import apiProvider from '../services/apiProvider';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('travel-app-user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('travel-app-token') || null;
  });

  useEffect(() => {
    if (token) {
      apiProvider.setToken(token);
      localStorage.setItem('travel-app-token', token);
    } else {
      apiProvider.clearToken();
      localStorage.removeItem('travel-app-token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('travel-app-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('travel-app-user');
    }
  }, [user]);

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    apiProvider.clearToken();
  };

  const isAuthenticated = () => !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
