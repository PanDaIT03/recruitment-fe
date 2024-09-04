import { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom';
import PATH from '~/utils/path';

import ProtectedRoute from '~/routes/ProtectedRoute';
import { lazy } from 'react';

const Home = lazy(() => import('~/pages/Home/Home'));
const NotFound = lazy(() => import('~/pages/NotFound/NotFound'));
const SignIn = lazy(() => import('~/pages/SignIn/SignIn'));
const SignUp = lazy(() => import('~/pages/SignUp/SignUp'));
const AdminDashboard = lazy(() => import('~/pages/Admin/AdminDashboard'));
const EmployerDashboard = lazy(
  () => import('~/pages/EmployerDashboard/EmployerDashboard')
);
const UserProfile = lazy(() => import('~/pages/User/UserProfile'));
const MainLayout = lazy(() => import('~/layouts/MainLayout'));
const AuthLayout = lazy(() => import('~/layouts/AuthLayout'));

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
    path: PATH.SIGNIN,
    element: <SignIn />,
    layout: AuthLayout,
  },
  {
    path: PATH.SIGNUP,
    element: <SignUp />,
    layout: AuthLayout,
  },
  {
    path: PATH.NOTFOUND,
    element: <NotFound />,
  },
];

export default routesConfig;
