import { Link } from 'react-router-dom';

import { Layout, Row } from 'antd';
import PATH from '~/utils/path';

const NotFound = () => {
  return (
    <Layout className="min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <Row className="text-base font-semibold text-indigo-600">404</Row>
      <Row>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
      </Row>
      <Row>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
      </Row>
      <Row className="mt-10 flex items-center justify-center gap-x-6">
        <Link
          to={PATH.ROOT}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Go back home
        </Link>
      </Row>
    </Layout>
  );
};

export default NotFound;
