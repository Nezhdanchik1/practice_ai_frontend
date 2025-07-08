// src/api/auth.js
import axios from 'axios';

const API_BASE = 'http://localhost:8082/api/v1/auth'; // замени на адрес твоего Go API

// Регистрация
export async function register(email, password) {
  const response = await axios.post(`${API_BASE}/register`, {
    email,
    password
  });
  return response.data;
}

// Логин
export async function login(email, password) {
  const response = await axios.post(`${API_BASE}/login`, {
    email,
    password
  });
  const { token } = response.data;
  localStorage.setItem('token', token);
  return token;
}

// Получить текущего пользователя (если авторизован)
export async function getProfile() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Нет токена');

  const response = await axios.get(`${API_BASE}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}

// Выход
export function logout() {
  localStorage.removeItem('token');
}

// Проверка: авторизован ли пользователь
export function isAuthenticated() {
  return !!localStorage.getItem('token');
}
