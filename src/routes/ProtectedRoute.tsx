import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '~/hooks/useStore';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const token = localStorage.getItem('token2');
  const userRole = currentUser?.role?.title || 'guest';

  return allowedRoles.includes(userRole) || token ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;
