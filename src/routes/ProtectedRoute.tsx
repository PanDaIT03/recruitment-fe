import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '~/hooks/useStore';
import useToken from '~/hooks/useToken';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { refreshToken } = useToken();
  const { currentUser } = useAppSelector((state) => state.auth);

  const userRole = currentUser?.role?.title;

  if (refreshToken && !userRole) return <Outlet />;

  return allowedRoles.includes(userRole || 'guest') ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;
