import React, { ComponentType, lazy, ReactNode } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import { PERMISSION } from '~/enums/permissions';

import AdminLayout from '~/layouts/AdminLayout';
import AuthLayout from '~/layouts/AuthLayout';
import JobApplicationLayout from '~/layouts/JobApplicationLayout';
import MainLayout from '~/layouts/MainLayout';
import UserLayout from '~/layouts/UserLayout';
import EmployerLayout from '~/pages/Employer/EmployerLayout';

import ProtectedRoute from '~/routes/ProtectedRoute';
import PATH from '~/utils/path';

// NOTFOUNT ROUTE
const NotFound = lazy(() => import('~/pages/NotFound/NotFound'));

// COMMON ROUTES
const Home = lazy(() => import('~/pages/Home/Home'));
const Blog = lazy(() => import('~/pages/Blog/Blogs'));
const JobList = lazy(() => import('~/pages/Job/JobList/JobList'));
const JobDetail = lazy(() => import('~/pages/Job/JobList/JobDetail'));
const JobSeeker = lazy(() => import('~/pages/Job/JobSeeker/JobSeeker'));

const UserSignIn = lazy(() => import('~/pages/Auth/User/SignIn/SignIn'));
const UserSignUp = lazy(() => import('~/pages/Auth/User/SignUp/SignUp'));
const EmployerSignIn = lazy(
  () => import('~/pages/Auth/Employer/SignIn/SignIn')
);
const EmployerSignUp = lazy(
  () => import('~/pages/Auth/Employer/SignUp/SignUp')
);
const UserForgotPassword = lazy(
  () => import('~/pages/Auth/User/ForgotPassword/ForgotPassword')
);
const UserResetPassword = lazy(
  () => import('~/pages/Auth/User/ResetPassword/ResetPassword')
);

// USER ROUTES
const UserResume = lazy(() => import('~/pages/User/Resume/Resume'));
const UserAccount = lazy(() => import('~/pages/User/Account/Account'));
const UserProfile = lazy(() => import('~/pages/User/Profile/Profile'));
const UserDesiredJob = lazy(() => import('~/pages/User/DesiredJob/DesiredJob'));
const UserAppliedJob = lazy(() => import('~/pages/User/AppliedJob/AppliedJob'));
const UserJobApplication = lazy(
  () => import('~/pages/User/JobApplication/JobApplication')
);

// EMPLOYER ROUTES
const PostingJob = lazy(() => import('~/pages/Employer/Job/PostingJob'));
const RecruitmentList = lazy(() => import('~/pages/Employer/Job/ManageJob'));
const UpdateJob = lazy(() => import('~/pages/Employer/Job/UpdateJob'));
const EmployerAccountPage = lazy(
  () => import('~/pages/Employer/Personal/EmployerAccountPage')
);
const EmployerDashboard = lazy(
  () => import('~/pages/Employer/Dashboard/EmployerDashboard')
);
const CandicateDashboard = lazy(
  () => import('~/pages/Employer/Candicates/CandicateDashboard')
);
const ManagementCandicates = lazy(
  () => import('~/pages/Employer/Candicates/ManagementCandicates')
);
const AddNewCandicate = lazy(
  () => import('~/pages/Employer/Candicates/AddNewCandicate')
);
const Recruitment = lazy(
  () => import('~/pages/Employer/RecruitmentList/Recruitment')
);
const RecruitmentDetail = lazy(
  () => import('~/pages/Employer/RecruitmentList/RecruimentDetail')
);

// ADMIN ROUTES
const AdminDashboard = lazy(() => import('~/pages/Admin/Dashboard/Dashboard'));
const JobManagement = lazy(() => import('~/pages/Admin/Job/JobManagement'));
const AdminPermission = lazy(
  () => import('~/pages/Admin/Setting/Permission/Permission')
);
const RoleDetailManagement = lazy(
  () => import('~/pages/Admin/Setting/Permission/Role/RoleDetail')
);
const UserDetail = lazy(
  () => import('~/pages/Admin/Setting/Permission/UserList/UserDetail')
);
const FunctionalGroupManagement = lazy(
  () => import('~/pages/Admin/FunctionalGroup/FunctionalGroup')
);
const FunctionalManagement = lazy(
  () => import('~/pages/Admin/Functionals/FunctionalManagement')
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
  allowedPermissions?: string[],
  layout?: React.ComponentType<{ children: React.ReactNode }>
): CustomRouteObject => ({
  path,
  element: (
    <ProtectedRoute
      allowedRoles={allowedRoles}
      allowedPermissions={allowedPermissions}
    />
  ),
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
    createRoute(PATH.JOB_LIST, <JobList />)
  ),

  // Admin
  createRoute('/admin', undefined, AdminLayout, [
    createProtectedRoute('', ['admin'], <AdminDashboard />),
    createProtectedRoute(PATH.ADMIN_DASHBOARD, ['admin'], <AdminDashboard />),
    createProtectedRoute(PATH.ADMIN_PERMISSION, ['admin'], <AdminPermission />),
    createProtectedRoute(
      PATH.ADMIN_JOB_MANAGEMENT,
      ['admin'],
      <JobManagement />
    ),
    createProtectedRoute(
      PATH.ADMIN_PERMISSION_USER_DETAIL,
      ['admin'],
      <UserDetail />
    ),
    createProtectedRoute(
      PATH.ADMIN_PERMISSION_ROLE_DETAIL,
      ['admin'],
      <RoleDetailManagement />
    ),
    createProtectedRoute(
      PATH.ADMIN_FUNCTIONAL_MANAGEMENT,
      ['admin'],
      <FunctionalManagement />
    ),
    createProtectedRoute(
      PATH.ADMIN_FUNCTIONAL_GROUP_MANAGEMENT,
      ['admin'],
      <FunctionalGroupManagement />
    ),
  ]),

  // Employer
  createRoute('/employer', undefined, EmployerLayout, [
    createProtectedRoute('', ['employer'], <EmployerDashboard />),
    createProtectedRoute(
      PATH.EMPLOYER_PERSONAL,
      ['employer'],
      <EmployerAccountPage />
    ),
    createProtectedRoute(
      PATH.EMPLOYER_DASHBOARD,
      ['employer'],
      <EmployerDashboard />
    ),
    createProtectedRoute(PATH.EMPLOYER_POSTING, ['employer'], <PostingJob />),
    createProtectedRoute(
      PATH.EMPLOYER_CANDICATES_ADDNEW,
      ['employer'],
      <AddNewCandicate />
    ),
    createProtectedRoute(
      PATH.EMPLOYER_CANDICATES_DASHBOARD,
      ['employer'],
      <CandicateDashboard />
    ),
    createProtectedRoute(
      PATH.EMPLOYER_CANDICATES_MANAGEMENT,
      ['employer'],
      <ManagementCandicates />
    ),
    createProtectedRoute(
      PATH.EMPLOYER_RECRUITMENT_LIST,
      ['employer'],
      <RecruitmentList />
    ),
    createProtectedRoute(PATH.UPDATE_JOB, ['employer'], <UpdateJob />),
    createProtectedRoute(
      PATH.EMPLOYER_RECRUITMENT,
      ['employer'],
      <Recruitment />
    ),

    createProtectedRoute(
      PATH.EMPLOYER_RECRUITMENT_DETAIL,
      ['employer'],
      <RecruitmentDetail />
    ),
  ]),

  // User
  createRoute('/user', undefined, UserLayout, [
    createProtectedRoute('', ['user'], <UserProfile />),
    createProtectedRoute(PATH.USER_PROFILE, ['user'], <UserProfile />, [
      PERMISSION.VIEW_PROFILE,
    ]),
    createProtectedRoute(PATH.USER_RESUME, ['user'], <UserResume />, [
      PERMISSION.VIEW_RESUME,
    ]),
    createProtectedRoute(PATH.USER_ACCOUNT, ['user'], <UserAccount />, [
      PERMISSION.USER_VIEW_ACCOUNT,
    ]),
    createProtectedRoute(PATH.USER_APPLIED_JOB, ['user'], <UserAppliedJob />, [
      PERMISSION.VIEW_APPLIED_JOB,
    ]),
    createProtectedRoute(PATH.USER_DESIRED_JOB, ['user'], <UserDesiredJob />, [
      PERMISSION.VIEW_DESIRED_JOB,
    ]),
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
