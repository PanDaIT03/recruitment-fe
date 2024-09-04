import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '~/hooks/useStore';
import MainLayout from '~/layouts/MainLayout';

const PublicRoute = () => {
  const { currentUser } = useAppSelector((state) => state.auth);
  // const { user } = useAuth();

  // // Nếu người dùng đã đăng nhập, chuyển hướng đến trang chính
  if (currentUser) return <Navigate to="/" />;

  // Nếu chưa đăng nhập, render nội dung của route
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default PublicRoute;
