import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';
import HeaderEmployer from '~/layouts/Header/HeaderEmployer';

const EmployerLayout = () => {
  return (
    <Layout className="min-h-screen">
      <HeaderEmployer />

      <Content className="px-16">
        <div className=" rounded-lg ">
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default EmployerLayout;
