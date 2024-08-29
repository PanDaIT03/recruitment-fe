import { RouteObject } from 'react-router-dom';
import Home from '~/pages/Home/Home';
import NotFound from '~/pages/NotFound/NotFound';
import PublicRoute from '~/routes/PublicRoute';
import PATH from '~/utils/path';
import adminRoutes from './adminRoutes';
import employerRoutes from './employerRoutes';
import userRoutes from './userRoutes';

const routesConfig: RouteObject[] = [
  {
    path: '/',
    element: <PublicRoute />,
    children: [{ path: PATH.ROOT, element: <Home /> }],
  },
  adminRoutes,
  employerRoutes,
  userRoutes,
  { path: PATH.NOTFOUND, element: <NotFound /> },
];

export default routesConfig;
