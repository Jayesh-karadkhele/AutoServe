import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SessionBootstrapLoader } from '../components/SessionBootstrapLoader';
import { getRoleDestination } from './roleUtils';

export const GuestOnlyRoute: React.FC = () => {
  const { status, user } = useAuth();

  if (status === 'bootstrapping') {
    return <SessionBootstrapLoader />;
  }

  if (status === 'authenticated' && user) {
    const destination = getRoleDestination(user.role);
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
};
