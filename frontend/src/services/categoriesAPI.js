import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

export const fetchCategories = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/categories${query ? `?${query}` : ''}`);
};

const categoriesService = { fetchCategories };
export default categoriesService;


