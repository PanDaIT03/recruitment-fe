import { ComponentType, lazy, ReactNode } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

import AuthLayout from '~/layouts/AuthLayout';
import MainLayout from '~/layouts/MainLayout';
import UserLayout from '~/layouts/UserLayout';
import EmployerLayout from '~/pages/Employer/EmployerLayout';

import PATH from '~/utils/path';

import CandicateDashboard from '~/pages/Employer/Candicates/CandicateDashboard';
import RecruitmentList from '~/pages/Employer/RecruitmentList/RecruitmentList';
import ProtectedRoute from '~/routes/ProtectedRoute';

const Home = lazy(() => import('~/pages/Home/Home'));
const SignIn = lazy(() => import('~/pages/Auth/SignIn/SignIn'));
const SignUp = lazy(() => import('~/pages/Auth/SignUp/SignUp'));
const NotFound = lazy(() => import('~/pages/NotFound/NotFound'));
const JobDetail = lazy(() => import('~/components/Job/JobDetail'));
const JobListPage = lazy(() => import('~/components/Job/JobList'));
const JobSeeker = lazy(() => import('~/pages/Job/JobSeeker/JobSeeker'));
const UserProfile = lazy(() => import('~/pages/User/Profile/Profile'));
const UserAccount = lazy(() => import('~/pages/User/Account/Account'));
const AdminDashboard = lazy(() => import('~/pages/Admin/AdminDashboard'));
const PostingJob = lazy(() => import('~/pages/Employer/PostingJob/PostingJob'));
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
  createRoutes(
    MainLayout,
    createRoute(PATH.ROOT, <Home />),
    createRoute(PATH.JOB_DETAIL, <JobDetail />),
    createRoute(PATH.JOB_SEEKER, <JobSeeker />),
    createRoute(PATH.JOB_LIST, <JobListPage />)
  ),

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
    createRoute(PATH.EMPLOYER_DASHBOARD, <EmployerDashboard />),
    createRoute(PATH.EMPLOYER_POSTING, <PostingJob />),
    createRoute(PATH.EMPLOYER_CANDICATES_DASHBOARD, <CandicateDashboard />),
    createRoute(PATH.EMPLOYER_RECRUITMENT_LIST, <RecruitmentList />)
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
