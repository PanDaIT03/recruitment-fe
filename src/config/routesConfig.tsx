import { ComponentType, lazy, ReactNode } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

import MainLayout from '~/layouts/MainLayout';
import EmployerLayout from '~/pages/Employer/EmployerLayout';
import UserLayout from '~/pages/User/UserLayout';
import ProtectedRoute from '~/routes/ProtectedRoute';
import PATH from '~/utils/path';

const Home = lazy(() => import('~/pages/Home/Home'));
const AuthLayout = lazy(() => import('~/layouts/AuthLayout'));
const SignIn = lazy(() => import('~/pages/Auth/SignIn/SignIn'));
const SignUp = lazy(() => import('~/pages/Auth/SignUp/SignUp'));
const NotFound = lazy(() => import('~/pages/NotFound/NotFound'));
const UserProfile = lazy(() => import('~/pages/User/Profile/Profile'));
const UserAccount = lazy(() => import('~/pages/User/Account/Account'));
const AdminDashboard = lazy(() => import('~/pages/Admin/AdminDashboard'));
const EmployerDashboard = lazy(
  () => import('~/pages/Employer/Dashboard/EmployerDashboard')
);
const ForgotPassword = lazy(
  () => import('~/pages/Auth/ForgotPassword/ForgotPassword')
);

type CustomRouteObject = RouteObject & {
  layout?: React.ComponentType<{ children: React.ReactNode }>;
};

const createRoute = (
  pathOrRoute: string | Partial<CustomRouteObject>,
  element?: React.ReactNode,
  layout?: React.ComponentType<{ children: React.ReactNode }>,
  children?: CustomRouteObject[]
): CustomRouteObject => {
  const baseRoute: Partial<CustomRouteObject> =
    typeof pathOrRoute === 'string' ? { path: pathOrRoute } : pathOrRoute;

  return {
    ...baseRoute,
    ...(element !== undefined && { element }),
    ...(layout !== undefined && { layout }),
    ...(children !== undefined && { children }),
  } as CustomRouteObject;
};

const createRoutes = (
  Layout: ComponentType<{ children: ReactNode }>,
  ...routes: (string | Partial<CustomRouteObject>)[]
): CustomRouteObject => ({
  element: (
    <Layout>
      <Outlet />
    </Layout>
  ),
  children: routes.map((route) =>
    typeof route === 'string' ? createRoute(route) : createRoute(route)
  ),
});

const createProtectedRoute = (
  path: string,
  allowedRoles: string[],
  layout?: React.ComponentType<{ children: React.ReactNode }>,
  ...children: (string | Partial<CustomRouteObject>)[]
): CustomRouteObject => ({
  path,
  element: <ProtectedRoute allowedRoles={allowedRoles} />,
  ...(layout !== undefined && { layout }),
  children: children.map((child) =>
    typeof child === 'string' ? createRoute(child) : createRoute(child)
  ),
});

const routesConfig: CustomRouteObject[] = [
  createRoute(PATH.ROOT, <Home />, MainLayout),

  // Admin
  createProtectedRoute(
    '/admin',
    ['admin'],
    undefined,
    { index: true, element: <AdminDashboard /> },
    createRoute(PATH.ADMIN_DASHBOARD, <AdminDashboard />)
  ),

  // Employer
  createProtectedRoute(
    '/employer',
    ['employer'],
    EmployerLayout,
    { index: true, element: <EmployerDashboard /> },
    createRoute(PATH.EMPLOYER_DASHBOARD, <EmployerDashboard />)
  ),

  // User
  createProtectedRoute(
    '/user',
    ['user'],
    UserLayout,
    { index: true, element: <UserProfile /> },
    createRoute(PATH.USER_PROFILE, <UserProfile />),
    createRoute(PATH.USER_ACCOUNT, <UserAccount />)
  ),

  // Auth
  createRoutes(
    AuthLayout,
    createRoute(PATH.SIGN_IN, <SignIn />),
    createRoute(PATH.SIGN_UP, <SignUp />),
    createRoute(PATH.FORGOT_PASSWORD, <ForgotPassword />)
  ),

  // Not Found
  createRoute(PATH.NOT_FOUND, <NotFound />),
];

export default routesConfig;
