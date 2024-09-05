import { Outlet, RouteObject } from 'react-router-dom';
import PATH from '~/utils/path';

import ProtectedRoute from '~/routes/ProtectedRoute';
import { ComponentType, lazy, ReactNode } from 'react';
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
    undefined,
    { index: true, element: <EmployerDashboard /> },
    createRoute(PATH.EMPLOYER_DASHBOARD, <EmployerDashboard />)
  ),

  // User
  createProtectedRoute(
    '/user',
    ['user'],
    undefined,
    { index: true, element: <UserProfile /> },
    createRoute(PATH.USER_PROFILE, <UserProfile />)
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
