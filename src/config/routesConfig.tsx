import { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom';
import PATH from '~/utils/path';

import ProtectedRoute from '~/routes/ProtectedRoute';
import { lazy } from 'react';
import ForgotPassword from '~/pages/Auth/ForgotPassword/ForgotPassword';

const AuthLayout = lazy(() => import('~/layouts/AuthLayout'));
const Home = lazy(() => import('~/pages/Home/Home'));
const SignIn = lazy(() => import('~/pages/Auth/SignIn/SignIn'));
const SignUp = lazy(() => import('~/pages/Auth/SignUp/SignUp'));
const NotFound = lazy(() => import('~/pages/NotFound/NotFound'));
const AdminDashboard = lazy(() => import('~/pages/Admin/AdminDashboard'));
const EmployerDashboard = lazy(
  () => import('~/pages/EmployerDashboard/EmployerDashboard')
);
const UserProfile = lazy(() => import('~/pages/User/UserProfile'));
const MainLayout = lazy(() => import('~/layouts/MainLayout'));

type CustomRouteObject = (IndexRouteObject | NonIndexRouteObject) & {
  layout?: React.ComponentType<{ children: React.ReactNode }>;
};

const adminRoutes: CustomRouteObject = {
  path: '/admin',
  element: <ProtectedRoute allowedRoles={['admin']} />,
  children: [
    { index: true, element: <AdminDashboard /> },
    { path: PATH.ADMIN_DASHBOARD, element: <AdminDashboard /> },
  ],
};

const employerRoutes: CustomRouteObject = {
  path: '/employer',
  element: <ProtectedRoute allowedRoles={['employer']} />,
  children: [
    { index: true, element: <EmployerDashboard /> },
    { path: PATH.EMPLOYER_DASHBOARD, element: <EmployerDashboard /> },
  ],
};

const userRoutes: CustomRouteObject = {
  path: '/user',
  element: <ProtectedRoute allowedRoles={['user']} />,
  children: [
    { index: true, element: <UserProfile /> },
    { path: PATH.USER_PROFILE, element: <UserProfile /> },
  ],
};

const routesConfig: CustomRouteObject[] = [
  {
    path: PATH.ROOT,
    element: <Home />,
    layout: MainLayout,
  },
  adminRoutes,
  employerRoutes,
  userRoutes,
  {
    path: PATH.SIGN_IN,
    element: <SignIn />,
    layout: AuthLayout,
  },
  {
    path: PATH.SIGN_UP,
    element: <SignUp />,
    layout: AuthLayout,
  },
  {
    path: PATH.FORGOT_PASSWORD,
    element: <ForgotPassword />,
    layout: AuthLayout,
  },

  {
    path: PATH.NOT_FOUND,
    element: <NotFound />,
  },
];

export default routesConfig;
