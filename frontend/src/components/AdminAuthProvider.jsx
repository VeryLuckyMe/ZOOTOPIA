import React, { createContext, useState, useContext } from 'react';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? { user } : null;
  });

  const login = (user) => {
    console.log("Logging in:", user); // Debugging
    setAdmin({ user });
    localStorage.setItem('user', user);
  };
  
  const logout = () => {
    console.log("Logging out"); // Debugging
    setAdmin(null);
    localStorage.removeItem('user');
  };
  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
