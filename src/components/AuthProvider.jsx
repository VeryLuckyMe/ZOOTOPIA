import React, { createContext, useState, useContext } from 'react';
import defaultProfileImage from '../assets/default_profile.png'; // Adjust the import path as needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    return username ? { username, role } : null;
  });

  const login = (id, username, role, email, profileImage) => {
    setUser({ username, role });
    
    // Store user-specific data
    localStorage.setItem('id', id);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    localStorage.setItem('email', email);
    
    // Store profile image with a user-specific key
    if (profileImage) {
      localStorage.setItem(`profileImage_${id}`, profileImage);
    }
  };

  const logout = () => {
    const currentUserId = localStorage.getItem('id');
    
    setUser(null);
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    
    
    
    // Do not remove the profile image, just remove the current user's specific profile image
    localStorage.removeItem(`profileImage_${currentUserId}`);
  };

  // When retrieving the profile image, use the current user's ID
  const retrieveProfileImage = () => {
    const currentUserId = localStorage.getItem('id');
    return localStorage.getItem(`profileImage_${currentUserId}`) || defaultProfileImage;
  };

  const retrieveAddress = () => {
    const currentUserId = localStorage.getItem('id');
    if (currentUserId) {
      return JSON.parse(localStorage.getItem(`userAddress_${currentUserId}`)) || {};
    }
    return {};
  };

  const updateAddress = (address) => {
    const currentUserId = localStorage.getItem('id');
    if (currentUserId) {
      localStorage.setItem(`userAddress_${currentUserId}`, JSON.stringify(address));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      retrieveProfileImage,
      retrieveAddress,
      updateAddress
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);