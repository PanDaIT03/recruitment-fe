import { BellOutlined, SnippetsOutlined } from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  ConfigProvider,
  Dropdown,
  Flex,
  Layout,
  Menu,
  MenuProps,
  Typography,
} from 'antd';
import classNames from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { AvatarPlaceHolder, HeaderLogoPrimary } from '~/assets/svg';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import './index.scss';

const { Text } = Typography;
const { Header, Sider, Content } = Layout;
const { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, LogoutOutlined } =
  icons;

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
          icon: <UserOutlined />,
          label: <Link to="/admin/profile">Trang cá nhân</Link>,
        },
        {
          key: '2',
          icon: <LogoutOutlined />,
          label: <span>Đăng xuất</span>,
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

  return (
    <Layout className="min-h-screen">
      <Sider
        width={250}
        collapsible
        theme="light"
        trigger={null}
        collapsed={collapsed}
        className="drop-shadow-lg"
        onCollapse={toggleCollapsed}
      >
        <Flex justify="center" className="py-2">
          <HeaderLogoPrimary
            className={classNames(
              'h-full cursor-pointer',
              collapsed ? 'max-w-7' : 'max-w-11'
            )}
            onClick={() => navigate(PATH.ROOT)}
          />
        </Flex>
        <Menu
          mode="inline"
          theme="light"
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
        <Header className="sticky flex bg-white items-center justify-between px-4 shadow-md top-0 right-0 z-50 rounded-b-md">
          <div>
            <Button
              type="text"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined className="text-[#f15224]" />
                ) : (
                  <MenuFoldOutlined className="text-[#f15224]" />
                )
              }
              style={{
                fontSize: '16px',
              }}
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>
          <div className="flex items-center justify-end mt-2 gap-4">
            <Badge count={5}>
              <BellOutlined style={{ fontSize: '18px' }} />
            </Badge>
            <Dropdown
              arrow
              menu={dropdownMenu}
              placement="bottomLeft"
              trigger={['click']}
            >
              <Avatar
                alt="avatar"
                className="!w-8 !h-8 border-gray-200 border cursor-pointer"
                src={<AvatarPlaceHolder className="!w-8 !h-8" />}
              />
            </Dropdown>
          </div>
        </Header>
        <Content className="p-6 pt-3">
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
