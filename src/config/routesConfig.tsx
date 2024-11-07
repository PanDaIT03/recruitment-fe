import React, { ComponentType, lazy, ReactNode } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

import AuthLayout from '~/layouts/AuthLayout';
import MainLayout from '~/layouts/MainLayout';
import UserLayout from '~/layouts/UserLayout';
import EmployerLayout from '~/pages/Employer/EmployerLayout';
import ProtectedRoute from '~/routes/ProtectedRoute';
import JobApplicationLayout from '~/layouts/JobApplicationLayout';

import PATH from '~/utils/path';
import AdminLayout from '~/layouts/AdminLayout';
import UserDetail from '~/pages/Admin/User/UserDetail';

const Home = lazy(() => import('~/pages/Home/Home'));
const JobManagement = lazy(() => import('~/pages/Admin/Job/JobManagement'));
const UserManagement = lazy(() => import('~/pages/Admin/User/UserManagement'));
const Blog = lazy(() => import('~/pages/Blog/Blogs'));
const NotFound = lazy(() => import('~/pages/NotFound/NotFound'));
const JobDetail = lazy(() => import('~/components/Job/JobDetail'));
const JobListPage = lazy(() => import('~/components/Job/JobList'));
const JobSeeker = lazy(() => import('~/pages/Job/JobSeeker/JobSeeker'));
const UserProfile = lazy(() => import('~/pages/User/Profile/Profile'));
const UserAccount = lazy(() => import('~/pages/User/Account/Account'));
const AdminDashboard = lazy(() => import('~/pages/Admin/AdminDashboard'));
const PostingJob = lazy(() => import('~/pages/Employer/PostingJob/PostingJob'));
const UserDesiredJob = lazy(() => import('~/pages/User/DesiredJob/DesiredJob'));
const EmployerDashboard = lazy(
  () => import('~/pages/Employer/Dashboard/EmployerDashboard')
);
const CandicateDashboard = lazy(
  () => import('~/pages/Employer/Candicates/CandicateDashboard')
);
const RecruitmentList = lazy(
  () => import('~/pages/Employer/RecruitmentList/RecruitmentList')
);
const UpdateJob = lazy(
  () => import('~/pages/Employer/RecruitmentList/UpdateJob')
);
const UserSignIn = lazy(() => import('~/pages/Auth/User/SignIn/SignIn'));
const UserSignUp = lazy(() => import('~/pages/Auth/User/SignUp/SignUp'));
const UserForgotPassword = lazy(
  () => import('~/pages/Auth/User/ForgotPassword/ForgotPassword')
);
const UserResetPassword = lazy(
  () => import('~/pages/Auth/User/ResetPassword/ResetPassword')
);
const EmployerSignIn = lazy(
  () => import('~/pages/Auth/Employer/SignIn/SignIn')
);
const EmployerSignUp = lazy(
  () => import('~/pages/Auth/Employer/SignUp/SignUp')
);
const UserJobApplication = lazy(
  () => import('~/pages/User/JobApplication/JobApplication')
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
  element: React.ReactNode,
  layout?: React.ComponentType<{ children: React.ReactNode }>
): CustomRouteObject => ({
  path,
  element: <ProtectedRoute allowedRoles={allowedRoles} />,
  ...(layout !== undefined && { layout }),
  children: [{ path: '', element }],
});

const routesConfig: CustomRouteObject[] = [
  createRoutes(
    MainLayout,
    createRoute(PATH.ROOT, <Home />),
    createRoute(PATH.BLOG, <Blog />),
    createRoute(PATH.JOB_DETAIL, <JobDetail />),
    createRoute(PATH.JOB_SEEKER, <JobSeeker />),
    createRoute(PATH.JOB_LIST, <JobListPage />)
  ),

  // Admin
  createRoute('/admin', undefined, AdminLayout, [
    createProtectedRoute('', ['admin'], <AdminDashboard />),
    createProtectedRoute(PATH.ADMIN_DASHBOARD, ['admin'], <AdminDashboard />),
    createProtectedRoute(
      PATH.ADMIN_JOB_MANAGEMENT,
      ['admin'],
      <JobManagement />
    ),
    createProtectedRoute(
      PATH.ADMIN_USER_MANAGEMENT,
      ['admin'],
      <UserManagement />
    ),
    createProtectedRoute(PATH.ADMIN_USER_DETAIL, ['admin'], <UserDetail />),
  ]),

  // Employer
  createRoute('/employer', undefined, EmployerLayout, [
    createProtectedRoute('', ['employer'], <EmployerDashboard />),
    createProtectedRoute(
      PATH.EMPLOYER_DASHBOARD,
      ['employer'],
      <EmployerDashboard />
    ),
    createProtectedRoute(PATH.EMPLOYER_POSTING, ['employer'], <PostingJob />),
    createProtectedRoute(
      PATH.EMPLOYER_CANDICATES_DASHBOARD,
      ['employer'],
      <CandicateDashboard />
    ),
    createProtectedRoute(
      PATH.EMPLOYER_RECRUITMENT_LIST,
      ['employer'],
      <RecruitmentList />
    ),
    createProtectedRoute(PATH.UPDATE_JOB, ['employer'], <UpdateJob />),
  ]),

  // User
  createRoute('/user', undefined, UserLayout, [
    createProtectedRoute('', ['user'], <UserProfile />),
    createProtectedRoute(PATH.USER_PROFILE, ['user'], <UserProfile />),
    createProtectedRoute(PATH.USER_ACCOUNT, ['user'], <UserAccount />),
    createProtectedRoute(PATH.USER_DESIRED_JOB, ['user'], <UserDesiredJob />),
  ]),

  //Job Application
  createRoute('/user', undefined, JobApplicationLayout, [
    createProtectedRoute(
      PATH.USER_JOB_APPLICATION,
      ['user'],
      <UserJobApplication />
    ),
  ]),

  // Auth
  createRoutes(
    AuthLayout,
    createRoute(PATH.USER_SIGN_IN, <UserSignIn />),
    createRoute(PATH.USER_SIGN_UP, <UserSignUp />),
    createRoute(PATH.USER_RESET_PASSWORD, <UserResetPassword />),
    createRoute(PATH.USER_FORGOT_PASSWORD, <UserForgotPassword />),
    createRoute(PATH.EMPLOYER_SIGN_IN, <EmployerSignIn />),
    createRoute(PATH.EMPLOYER_SIGN_UP, <EmployerSignUp />)
  ),

  // Not Found
  createRoute(PATH.NOT_FOUND, <NotFound />),
];

export default routesConfig;
