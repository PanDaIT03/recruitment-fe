import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Loading from '~/components/Loading/Loading';
import routesConfig from '~/config/routesConfig';

const wrapWithLayout = (
  element: React.ReactNode,
  Layout?: React.ComponentType<{ children: React.ReactNode }>
) => {
  if (Layout) {
    return <Layout>{element}</Layout>;
  }
  return element;
};

const AppRouter = () => {
  const routes = createBrowserRouter(
    routesConfig.map((route) => ({
      ...route,
      element: wrapWithLayout(route.element, route.layout),
    }))
  );

  return (
    <React.Suspense fallback={<Loading />}>
      <RouterProvider router={routes} />
    </React.Suspense>
  );
};

export default AppRouter;
