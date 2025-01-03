import {
  BellOutlined,
  SnippetsOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  ConfigProvider,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  Typography,
} from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import './index.scss';

const { Header, Sider, Content } = Layout;
const { MenuUnfoldOutlined, MenuFoldOutlined } = icons;

const MENU_ITEMS = [
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
    key: 'management',
    label: 'Quản lý',
    icon: <SnippetsOutlined />,
    children: [
      {
        key: PATH.ADMIN_JOB_MANAGEMENT,
        label: 'Danh sách công việc',
      },
      {
        key: PATH.ADMIN_USER_MANAGEMENT,
        label: 'Danh sách người dùng',
      },
      {
        key: PATH.ADMIN_ROLE_MANAGEMENT,
        label: 'Danh sách vai trò',
      },
      {
        key: PATH.ADMIN_FUNCTIONAL_MANAGEMENT,
        label: 'Danh sách chức năng',
      },
      {
        key: PATH.ADMIN_FUNCTIONAL_GROUP_MANAGEMENT,
        label: 'Danh sách nhóm chức năng',
      },
    ],
  },
] as MenuProps['items'];

const { Text } = Typography;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate(),
    location = useLocation();

  const { title } = useTitle(),
    { breadcrumb } = useBreadcrumb();

  const [collapsed, setCollapsed] = useState(false);

  const firstRender = useRef(true);

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

  const defaultOpenKeys = useMemo(() => {
    return (MENU_ITEMS?.find((item: any) =>
      item?.children?.find((i: any) => i?.key === location?.state?.key)
    )?.key ?? null) as string;
  }, [location]);

  useEffect(() => {
    if (!firstRender) return;

    navigate(location?.pathname, { state: { key: location?.pathname } });
  }, [firstRender]);

  // console.log('Key:', location.state?.key);
  // console.log('Parent Key:', defaultOpenKeys);
  // console.log('Selected Key:', location.state?.key ? [location.state.key] : []);
  // console.log('Default Open Keys:', defaultOpenKeys);

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
          defaultOpenKeys={defaultOpenKeys ? [defaultOpenKeys] : []}
          selectedKeys={location.state?.key ? [location.state.key] : []}
          onSelect={(e) =>
            navigate(e?.key, {
              state: { key: e?.key, parentKey: e?.keyPath?.[1] },
            })
          }
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
        <Content className="p-6 pt-3 admin-bg">
          <Text className="font-bold text-2xl text-admin-primary">{title}</Text>
          <ConfigProvider
            theme={{
              components: {
                Breadcrumb: {
                  itemColor: 'white',
                  lastItemColor: '#ffac69',
                  separatorColor: 'white',
                },
              },
            }}
          >
            <Breadcrumb items={breadcrumb} />
          </ConfigProvider>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
