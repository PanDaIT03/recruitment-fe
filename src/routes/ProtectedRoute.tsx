import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '~/hooks/useAuth';

const ProtectedRoute = () => {
  const { user } = useAuth();

  // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!user) return <Navigate to="/login" />;

  // Nếu đã đăng nhập, render nội dung của route
  return <Outlet />;
};

export default ProtectedRoute;
