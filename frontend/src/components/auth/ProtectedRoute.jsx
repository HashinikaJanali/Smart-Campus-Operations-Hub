import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  try {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) return <Navigate to="/login" />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" />;
    }

    return children;
  } catch (error) {
    console.error('Error in ProtectedRoute:', error);
    localStorage.removeItem('user');
    return <Navigate to="/login" />;
  }
}