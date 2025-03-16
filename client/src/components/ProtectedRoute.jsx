import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = document.cookie.split(';').find(c => c.trim().startsWith("token="));
  if (!token) {
    console.error("ProtectedRoute: No token found, redirecting to login.");
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
