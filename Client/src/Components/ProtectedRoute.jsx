import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Function to check if user is authenticated
const isAuthenticated = () => {
  // Check localStorage for authentication state
  return localStorage.getItem('isAuthenticated') === 'true' && 
         localStorage.getItem('userRole') === 'admin';
};

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Log for debugging
  useEffect(() => {
    console.log('ProtectedRoute check:', isAuthenticated(), 'Path:', location.pathname);
  }, [location]);
  
  // If trying to access admin routes but not authenticated, redirect to login
  if (!isAuthenticated()) {
    // Redirect to admin login page
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }
  
  return children;
};

export default ProtectedRoute; 