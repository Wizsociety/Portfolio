import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


// Export AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (token && isTokenExpired(token)) {
      logout();
    }
  }, [token]);

  const isTokenExpired = (token) => {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  };

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      const { token, role } = response.data;

      const userData = { username, role };
      setUser(userData);
      setToken(token);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
