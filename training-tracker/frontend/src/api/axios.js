import axios from 'axios';
//const API_URL = "https://training-management-7g9w.vercel.app";
const api = axios.create({ baseURL: 'https://training-management-7g9w.vercel.app' });
//const api = axios.create({ baseURL: 'http://localhost:5000/api' });

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;