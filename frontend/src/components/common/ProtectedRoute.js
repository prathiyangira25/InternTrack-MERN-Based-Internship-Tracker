import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ isAuthenticated, userRole, user, children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Double-check token exists in localStorage
    const token = localStorage.getItem('token');
    if (!token && isAuthenticated) {
      toast.error('Session expired. Please log in again.');
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  // If userRole is specified and doesn't match user's role, redirect
  if (userRole && user?.role !== userRole) {
    // Redirect students trying to access coordinator routes to student dashboard
    if (user?.role === 'student') {
      return <Navigate to="/student/dashboard" />;
    }
    
    // Redirect coordinators trying to access student routes to coordinator dashboard
    if (user?.role === 'coordinator') {
      return <Navigate to="/coordinator/dashboard" />;
    }
    
    // Fallback to home
    return <Navigate to="/" />;
  }
  
  // If all checks pass, render the children
  return children;
};

export default ProtectedRoute;