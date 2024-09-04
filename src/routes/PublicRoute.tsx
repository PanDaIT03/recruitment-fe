import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '~/hooks/useStore';
import MainLayout from '~/layouts/MainLayout';
import PATH from '~/utils/path';

const PublicRoute = () => {
  const { currentUser } = useAppSelector((state) => state.auth);

  // // Nếu người dùng đã đăng nhập, chuyển hướng đến trang chính
  if (Object.values(currentUser).length > 0) return <Navigate to={PATH.ROOT} />;

  // Nếu chưa đăng nhập, render nội dung của route
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default PublicRoute;
