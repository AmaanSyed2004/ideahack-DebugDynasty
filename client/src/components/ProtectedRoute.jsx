import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    console.error("ProtectedRoute: No login flag found, redirecting to login.");
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
