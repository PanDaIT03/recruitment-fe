import { RouteObject } from 'react-router-dom';
import AdminDashboard from '~/pages/Admin/AdminDashboard';
import EmployerDashboard from '~/pages/EmployerDashboard/EmployerDashboard';

import Home from '~/pages/Home/Home';
import NotFound from '~/pages/NotFound/NotFound';
import UserProfile from '~/pages/User/UserProfile';
import ProtectedRoute from '~/routes/ProtectedRoute';
import PublicRoute from '~/routes/PublicRoute';
import PATH from '~/utils/path';

const routesConfig: RouteObject[] = [
  {
    path: '/',
    element: <PublicRoute />,
    children: [
      {
        path: PATH.ROOT,
        element: <Home />,
      },
    ],
  },
  // Route admin
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: PATH.ADMIN_DASHBOARD,
        element: <AdminDashboard />,
      },
    ],
  },
  // Route  employer
  {
    path: '/employer',
    element: <ProtectedRoute allowedRoles={['employer']} />,
    children: [
      {
        index: true,
        element: <EmployerDashboard />,
      },
      {
        path: PATH.EMPLOYER_DASHBOARD,
        element: <EmployerDashboard />,
      },
    ],
  },
  // Route  user
  {
    path: '/user',
    element: <ProtectedRoute allowedRoles={['user']} />,
    children: [
      {
        index: true,
        element: <UserProfile />,
      },
      {
        path: PATH.USER_PROFILE,
        element: <UserProfile />,
      },
    ],
  },
  {
    path: PATH.NOTFOUND,
    element: <NotFound />,
  },
];

export default routesConfig;
