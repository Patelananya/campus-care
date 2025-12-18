import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, logout } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData.user);
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout: logoutUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};