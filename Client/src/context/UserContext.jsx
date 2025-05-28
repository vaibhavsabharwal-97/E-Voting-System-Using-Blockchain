import React, { createContext, useState, useContext } from "react";

// Create the user context
export const UserContext = createContext();

// Custom hook for using the user context
export const useUser = () => useContext(UserContext);

// Provider component that wraps your app
export const UserProvider = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to set authenticated user data
  const authenticateUser = (userData) => {
    setAuthenticatedUser(userData);
    setIsAuthenticated(true);
  };

  // Function to clear authentication
  const clearAuthentication = () => {
    setAuthenticatedUser(null);
    setIsAuthenticated(false);
  };

  // Value object that will be shared with all components
  const value = {
    authenticatedUser,
    isAuthenticated,
    authenticateUser,
    clearAuthentication
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 