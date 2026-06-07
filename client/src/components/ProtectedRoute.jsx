import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Loader } from './Loader';

// Helper component to secure pages based on authentication states and role permissions
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        addToast('Please sign in to continue.', 'error');
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (allowedRoles.includes('Recruiter')) {
          addToast('Only recruiters can access this page.', 'error');
        } else {
          addToast('Access denied: Insufficient permissions.', 'error');
        }
      }
    }
  }, [user, loading, allowedRoles, addToast]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    // Direct unauthorized guests back to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect authorized users lacking correct permissions back to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
