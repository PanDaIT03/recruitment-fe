// layouts/AdminLayout.tsx
import { BellOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const { MenuUnfoldOutlined, MenuFoldOutlined } = icons;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/admin/profile">Trang cá nhân</Link>
      </Menu.Item>
      <Menu.Item key="logout">Đăng xuất</Menu.Item>
    </Menu>
  );

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        theme="light"
        width={250}
        trigger={null}
      >
        <div className="p-4 text-center">LOGO</div>
        <Menu theme="light" mode="inline">
          <SubMenu key="dashboard" icon={<BellOutlined />} title="Dashboard">
            <Menu.Item key="overview">
              <Link to={PATH.ADMIN_DASHBOARD}>Tổng quan</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="jobs"
            icon={<SettingOutlined />}
            title="Quản lý công việc"
          >
            <Menu.Item key="job-list">
              <Link to={PATH.ADMIN_JOB_MANAGEMENT}>Danh sách công việc</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="users"
            icon={<UserOutlined />}
            title="Quản lý người dùng"
          >
            <Menu.Item key="user-list">
              <Link to={PATH.ADMIN_USER_MANAGEMENT}>Danh sách người dùng</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout>
        <Header className="flex items-center justify-between bg-white px-4 shadow-md">
          <div>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
              }}
            />
          </div>
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
