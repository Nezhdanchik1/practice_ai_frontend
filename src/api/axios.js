// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081', // замени на свой backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерсептор для всех запросов
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // или sessionStorage, если ты туда сохраняешь токен

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
