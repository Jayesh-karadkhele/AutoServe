import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../api/authContracts';
import { SessionBootstrapLoader } from '../components/SessionBootstrapLoader';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === 'bootstrapping') {
    return <SessionBootstrapLoader />;
  }

  if (status === 'anonymous' || !user) {
    // Preserve intended destination safely without open redirect vulnerability
    const safeFrom = location.pathname.startsWith('/') ? location.pathname : '/login';
    return <Navigate to="/login" state={{ from: safeFrom }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role;
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  return <Outlet />;
};
