import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '~/hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user } = useAuth();

  const userRole = user?.role || 'user';

  return allowedRoles.includes(userRole) ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;
