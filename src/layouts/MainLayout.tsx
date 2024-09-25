import Layout from 'antd/es/layout/layout';
import { ReactNode } from 'react';

import Footer from './Footer/Footer';
import Header from './Header/Header';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Layout className="min-h-screen">
      <Header />
      <div className="bg-main">{children}</div>
      <Footer />
    </Layout>
  );
};

export default MainLayout;
