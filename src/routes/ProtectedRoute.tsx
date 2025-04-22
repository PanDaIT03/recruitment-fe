import { Navigate, Outlet } from 'react-router-dom';
import { usePermission } from '~/hooks/usePermission';
import { useAppSelector } from '~/hooks/useStore';
import useToken from '~/hooks/useToken';

interface ProtectedRouteProps {
  allowedRoles: string[];
  allowedPermissions?: string[];
}

const ProtectedRoute = ({
  allowedRoles,
  allowedPermissions,
}: ProtectedRouteProps) => {
  const { refreshToken } = useToken();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { hasPermissions } = usePermission(allowedPermissions);

  const userRole = currentUser?.role?.title;

  if (refreshToken && !userRole) return <Outlet />;

  const hasRole = userRole && allowedRoles.includes(userRole);
  return hasRole && hasPermissions ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
