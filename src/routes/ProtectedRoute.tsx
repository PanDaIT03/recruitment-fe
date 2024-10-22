import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '~/contexts/useContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user } = useUser();

  const userRole = user?.role?.title || 'guest';
  console.log(userRole);
  return allowedRoles.includes(userRole || 'guest') ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;
