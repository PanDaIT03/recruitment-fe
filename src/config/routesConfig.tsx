import { RouteObject } from 'react-router-dom';
import Home from '~/pages/Home/Home';
import NotFound from '~/pages/NotFound/NotFound';
import adminRoutes from '~/routes/adminRoutes';
import employerRoutes from '~/routes/employerRoutes';
import PublicRoute from '~/routes/PublicRoute';
import userRoutes from '~/routes/userRoutes';
import PATH from '~/utils/path';

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
