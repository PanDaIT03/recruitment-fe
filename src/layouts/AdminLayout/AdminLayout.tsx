import { BellOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, Layout, Menu, MenuProps } from 'antd';
import React, { useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import icons from '~/utils/icons';
import PATH from '~/utils/path';
import './index.scss';

const { Header, Sider, Content } = Layout;
const { MenuUnfoldOutlined, MenuFoldOutlined } = icons;

export const MENU_ITEMS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <BellOutlined />,
    children: [
      {
        key: PATH.ADMIN_DASHBOARD,
        label: 'Tổng quan',
      },
    ],
  },
  {
    key: 'jobManagement',
    label: 'Quản lý công việc',
    icon: <SettingOutlined />,
    children: [
      {
        key: PATH.ADMIN_JOB_MANAGEMENT,
        label: 'Danh sách công việc',
      },
    ],
  },
  {
    key: 'userManagement',
    label: 'Danh sách người dùng',
    icon: <UserOutlined />,
    children: [
      {
        key: PATH.ADMIN_USER_MANAGEMENT,
        label: 'Danh sách người dùng',
      },
    ],
  },
] as MenuProps['items'];

const AdminLayout: React.FC = () => {
  const navigate = useNavigate(),
    location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const dropdownMenu = useMemo(() => {
    return {
      items: [
        {
          key: '1',
          label: <Link to="/admin/profile">Trang cá nhân</Link>,
        },
        {
          key: '2',
          label: <p>Đăng xuất</p>,
        },
      ],
    } as MenuProps;
  }, []);

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        theme="dark"
        width={250}
        trigger={null}
      >
        <div className="p-4 text-center text-[#ffac69]">LOGO</div>
        <Menu
          theme="dark"
          mode="inline"
          items={MENU_ITEMS}
          defaultOpenKeys={[location.state?.key]}
          selectedKeys={[location.state?.key]}
          onSelect={(e) => navigate(e.key, { state: { key: e.key } })}
        />
      </Sider>
      <Layout>
        <Header className="flex items-center justify-between admin-bg px-4 shadow-md">
          <div>
            <Button
              type="text"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined className="text-[#ffac69]" />
                ) : (
                  <MenuFoldOutlined className="text-[#ffac69]" />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
              }}
            />
          </div>
          <div className="flex items-center justify-end mt-2 gap-4">
            <Badge count={5}>
              <BellOutlined
                className="text-[#ffac69]"
                style={{ fontSize: '18px' }}
              />
            </Badge>
            <Dropdown menu={dropdownMenu}>
              <Avatar
                size="large"
                className="bg-white"
                icon={<UserOutlined className="text-[#ffac69]" />}
              />
            </Dropdown>
          </div>
        </Header>
        <Content className="p-6 admin-bg">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
