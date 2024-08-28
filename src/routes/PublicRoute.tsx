import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '~/hooks/useAuth';
import MainLayout from '~/layouts/MainLayout';

const PublicRoute = () => {
  const { user } = useAuth();

  // Nếu người dùng đã đăng nhập, chuyển hướng đến trang chính
  if (user) return <Navigate to="/" />;

  // Nếu chưa đăng nhập, render nội dung của route
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default PublicRoute;
