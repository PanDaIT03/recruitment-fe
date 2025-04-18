import { Navigate, Outlet } from 'react-router-dom';
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

  const { functionals, role } = currentUser;
  const userRole = role?.title;

  if (refreshToken && !userRole) return <Outlet />;

  const userPermissions = functionals?.map((functional) => functional.code);

  const hasRole = userRole && allowedRoles.includes(userRole);
  const hasPermission = allowedPermissions?.length
    ? !!userPermissions.filter((perm) => allowedPermissions.includes(perm))
        .length
    : true;

  return hasRole && hasPermission ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
