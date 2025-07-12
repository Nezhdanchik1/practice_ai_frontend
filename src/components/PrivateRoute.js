// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const isTokenExpired = (token) => {
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const exp = decodedPayload.exp;

    if (!exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return now >= exp;
  } catch (error) {
    return true; // Если токен невалидный
  }
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token'); // Очистим, если просрочен
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
