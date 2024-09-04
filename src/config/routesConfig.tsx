import { RouteObject } from 'react-router-dom';

import PATH from '~/utils/path';

import adminRoutes from '~/routes/adminRoutes';
import employerRoutes from '~/routes/employerRoutes';
import PublicRoute from '~/routes/PublicRoute';
import userRoutes from '~/routes/userRoutes';

import Home from '~/pages/Home/Home';
import NotFound from '~/pages/NotFound/NotFound';
import SignIn from '~/pages/SignIn/SignIn';

const routesConfig: RouteObject[] = [
  {
    path: '/',
    element: <PublicRoute />,
    children: [{ path: PATH.ROOT, element: <Home /> }],
  },
  adminRoutes,
  employerRoutes,
  userRoutes,
  { path: PATH.SIGIN, element: <SignIn /> },
  { path: PATH.NOTFOUND, element: <NotFound /> },
];

export default routesConfig;
