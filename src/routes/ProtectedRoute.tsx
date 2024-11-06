import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '~/hooks/useStore';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const userRole = currentUser?.role?.title;

  return allowedRoles.includes(userRole || 'admin') ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;
