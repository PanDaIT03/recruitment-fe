import { RouteObject } from 'react-router-dom';

import PATH from '~/utils/path';

import adminRoutes from '~/routes/adminRoutes';
import employerRoutes from '~/routes/employerRoutes';
import PublicRoute from '~/routes/PublicRoute';
import userRoutes from '~/routes/userRoutes';

import ForgotPassword from '~/pages/Auth/ForgotPassword/ForgotPassword';
import ResetPassword from '~/pages/Auth/ResetPassword/ResetPassword';
import SignIn from '~/pages/Auth/SignIn/SignIn';
import SignUp from '~/pages/Auth/SignUp/SignUp';
import Home from '~/pages/Home/Home';
import NotFound from '~/pages/NotFound/NotFound';

const routesConfig: RouteObject[] = [
  {
    path: '/',
    element: <PublicRoute />,
    children: [{ path: PATH.ROOT, element: <Home /> }],
  },
  adminRoutes,
  employerRoutes,
  userRoutes,
  { path: PATH.SIGN_IN, element: <SignIn /> },
  { path: PATH.SIGN_UP, element: <SignUp /> },
  { path: PATH.RESET_PASSWORD, element: <ResetPassword /> },
  { path: PATH.FORGOT_PASSWORD, element: <ForgotPassword /> },
  { path: PATH.NOT_FOUND, element: <NotFound /> },
];

export default routesConfig;
