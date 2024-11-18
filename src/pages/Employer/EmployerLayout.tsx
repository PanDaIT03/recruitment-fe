import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';
import HeaderEmployer from '~/layouts/Header/HeaderEmployer';

const EmployerLayout = () => {
  return (
    <Layout className="min-h-screen min-w-full container ">
      <HeaderEmployer />

      <Content className="w-full">
        <div className="w-full">
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default EmployerLayout;
