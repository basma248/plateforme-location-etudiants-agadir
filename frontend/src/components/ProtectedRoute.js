import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../services/authService';

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 */
export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;


