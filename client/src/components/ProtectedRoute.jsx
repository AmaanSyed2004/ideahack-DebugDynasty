// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) {
    console.error("ProtectedRoute: No user found, redirecting to login.");
    return <Navigate to="/login" />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.error("ProtectedRoute: User role not authorized, redirecting to home.");
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
