import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchCategories = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/categories${query ? `?${query}` : ''}`);
};

export const createCategory = (categoryData) => {
  return api.post('/categories', categoryData);
};

export const updateCategory = (categoryId, categoryData) => {
  return api.put(`/categories/${categoryId}`, categoryData);
};

export const deleteCategory = (categoryId) => {
  return api.delete(`/categories/${categoryId}`);
};

const categoriesService = { 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
};
export default categoriesService;


