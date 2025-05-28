import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const AdminLogout = () => {
  useEffect(() => {
    // Clear authentication data from localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
  }, []);

  // Redirect to home page
  return <Navigate to="/" replace />;
};

export default AdminLogout;
