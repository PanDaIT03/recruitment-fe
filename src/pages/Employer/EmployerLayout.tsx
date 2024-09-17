import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { Outlet } from 'react-router-dom';

const EmployerLayout = () => {
  return (
    <Layout className="min-h-screen">
      <Sider theme="light" width={400}></Sider>

      <Content className="p-6 bg-gray-100">
        <div className="bg-white p-4 rounded-lg shadow">
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default EmployerLayout;
