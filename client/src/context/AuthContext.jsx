import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Synchronize auth tokens with localStorage and Axios requests headers
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user profile details on app mount if token is stored
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/api/auth/profile');
        setUser(response.data);
      } catch (err) {
        console.error('Failed to load user profile on mount:', err);
        // Invalidate session if token check fails (e.g. expired token)
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  // Log in existing users (initiates OTP flow)
  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  };

  // Verify OTP to complete login and retrieve JWT session
  const verifyOtp = async (email, otp) => {
    const response = await api.post('/api/auth/verify-otp', { email, otp });
    setToken(response.data.token);
    setUser({
      _id: response.data._id,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role
    });
    return response.data;
  };

  // Sign up new users (registration only, does not auto-login)
  const signup = async (name, email, password, role) => {
    const response = await api.post('/api/auth/register', { name, email, password, role });
    return response.data;
  };

  // Sign out current session
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, verifyOtp, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
