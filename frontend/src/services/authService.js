import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Student registration
export const registerStudent = async (userData) => {
  try {
    const response = await api.post('/auth/register/student', userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error('Network error or server is not responding');
    }
  }
};

// User login
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    // Save token and user data to localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error('Network error or server is not responding');
    }
  }
};

// Admin creates Manager
export const createManager = async (managerData) => {
  try {
    const response = await api.post('/auth/manager', managerData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error('Network error or server is not responding');
    }
  }
};

// Admin gets all Managers
export const getAllManagers = async () => {
  try {
    const response = await api.get('/auth/managers');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error('Network error or server is not responding');
    }
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export default api;