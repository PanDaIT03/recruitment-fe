// layouts/AdminLayout.tsx
import { BellOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Dropdown, Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import PATH from '~/utils/path';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/admin/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        theme="light"
      >
        <div className="p-4 text-center">LOGO</div>
        <Menu theme="light" mode="inline">
          <SubMenu key="dashboard" icon={<BellOutlined />} title="Dashboard">
            <Menu.Item key="overview">
              <Link to={PATH.ADMIN_DASHBOARD}>Overview</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="jobs" icon={<SettingOutlined />} title="Job Management">
            <Menu.Item key="job-list">
              <Link to={PATH.ADMIN_JOB_MANAGEMENT}>Job List</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="users" icon={<UserOutlined />} title="User Management">
            <Menu.Item key="user-list">
              <Link to={PATH.ADMIN_USER_MANAGEMENT}>User List</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout>
        <Header className="bg-white px-4 shadow-md">
          <div className="flex items-center justify-end mt-2 gap-4">
            <Badge count={5}>
              <BellOutlined style={{ fontSize: '18px' }} />
            </Badge>

            <Dropdown overlay={menu}>
              <Avatar size="large" icon={<UserOutlined />} />
            </Dropdown>
          </div>
        </Header>
        <Content className="p-6 bg-gray-100">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
