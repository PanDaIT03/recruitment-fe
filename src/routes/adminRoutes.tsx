import PATH from '~/utils/path';
import AdminDashboard from '~/pages/Admin/AdminDashboard';
import ProtectedRoute from '~/routes/ProtectedRoute';

const adminRoutes = {
  path: '/admin',
  element: <ProtectedRoute allowedRoles={['admin']} />,
  children: [
    { index: true, element: <AdminDashboard /> },
    { path: PATH.ADMIN_DASHBOARD, element: <AdminDashboard /> },
  ],
};

export default adminRoutes;
