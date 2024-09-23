import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';
import HeaderEmployer from '~/layouts/Header/HeaderEmployer';

const EmployerLayout = () => {
  return (
    <Layout className="min-h-screen">
      <HeaderEmployer />

      <Content className="p-6 bg-[#e5e7eb]">
        <div className="bg-white p-4 rounded-lg shadow">
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default EmployerLayout;
