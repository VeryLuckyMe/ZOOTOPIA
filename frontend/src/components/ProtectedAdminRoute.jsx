import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthProvider';

const ProtectedAdminRoute = ({ children }) => {
  const { admin } = useAdminAuth();

  return admin ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedAdminRoute;