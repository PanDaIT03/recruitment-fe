import { BellOutlined, SnippetsOutlined } from '@ant-design/icons';
import { googleLogout } from '@react-oauth/google';
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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { AvatarPlaceHolder, HeaderLogoPrimary } from '~/assets/svg';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import { useAppDispatch } from '~/hooks/useStore';
import { signOut } from '~/store/thunk/auth';
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
        label: 'Danh sách chức vụ',
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
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { title } = useTitle();
  const { breadcrumb } = useBreadcrumb();

  const firstRender = useRef(true);
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(!collapsed);
  }, []);

  const handleSignOut = useCallback(() => {
    googleLogout();
    dispatch(signOut()).then(() => navigate(PATH.ROOT));
  }, []);

  const dropdownMenu = useMemo(() => {
    return {
      items: [
        {
          key: '1',
          icon: <UserOutlined />,
          label: <Link to="#">Trang cá nhân</Link>,
        },
        {
          key: '2',
          icon: <LogoutOutlined className="!text-warning" />,
          label: <span className="text-warning font-medium">Đăng xuất</span>,
          onClick: handleSignOut,
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
              <BellOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
            </Badge>
            <Dropdown
              arrow
              menu={dropdownMenu}
              trigger={['click']}
              placement="bottomLeft"
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
          <Text className="font-bold text-2xl text-[#f15227]">{title}</Text>
          <ConfigProvider
            theme={{
              components: {
                Breadcrumb: {
                  itemColor: '#959292',
                  lastItemColor: '#f15227',
                  separatorColor: '#f15227',
                },
              },
            }}
          >
            <Breadcrumb items={breadcrumb} />
          </ConfigProvider>
          <div className="mt-4">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
