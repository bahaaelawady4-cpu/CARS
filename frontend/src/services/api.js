import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// ─── JWT Interceptor ──────────────────────────────────────────
// Automatically add the token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth API ────────────────────────────────────────────────
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

// ─── Car API ─────────────────────────────────────────────────
export const getCars = (params) => api.get('/cars', { params });
export const getCarById = (id) => api.get(`/cars/${id}`);
export const createCar = (formData) => api.post('/cars', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateCar = (id, formData) => api.put(`/cars/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteCar = (id) => api.delete(`/cars/${id}`);

export default api;
