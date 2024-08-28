import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routesConfig from '~/config/routesConfig';

const AppRouter = () => {
  const routes = createBrowserRouter(routesConfig);

  return <RouterProvider router={routes} />;
};

export default AppRouter;
