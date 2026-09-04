import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoleDestination } from './roleUtils';

export const RoleRedirect: React.FC = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const destination = getRoleDestination(user.role);
  return <Navigate to={destination} replace />;
};
