import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/users/profile');
      setUser(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
      setToken(null); // Invalid token
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post('/api/users/login', { email, password });
      setToken(data.token);
      setUser(data);
      return true;
    } catch (err) {
      let errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post('/api/users', { name, email, password });
      setToken(data.token);
      setUser(data);
      return true;
    } catch (err) {
      let errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
