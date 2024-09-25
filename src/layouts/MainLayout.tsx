import Layout from 'antd/es/layout/layout';
import { ReactNode } from 'react';

import PATH from '~/utils/path';
import Footer from './Footer/Footer';
import Header, { MenuItem } from './Header/Header';

const items: MenuItem[] = [
  {
    key: PATH.JOB_SEEKER,
    label: 'Danh sách ứng viên',
  },
  {
    key: PATH.JOB_LIST,
    label: 'Tin tuyển dụng',
  },
  {
    key: 'blog',
    label: 'Blog',
  },
];

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Layout className="min-h-screen">
      <Header items={items} />
      <div className="bg-main">{children}</div>
      <Footer />
    </Layout>
  );
};

export default MainLayout;
