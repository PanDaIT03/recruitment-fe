import { BellOutlined } from '@ant-design/icons';
import { googleLogout } from '@react-oauth/google';
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  ConfigProvider,
  Dropdown,
  Layout,
  MenuProps,
  Spin,
  Typography,
} from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import { AvatarPlaceHolder } from '~/assets/svg';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { signOut } from '~/store/thunk/auth';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import Sidebar from './Sidebar/Sidebar';

const { Text } = Typography;
const { Header, Content } = Layout;
const { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, LogoutOutlined } =
  icons;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { title } = useTitle();
  const { breadcrumb } = useBreadcrumb();

  const [collapsed, setCollapsed] = useState(false);
  const { currentUser, loading } = useAppSelector((state) => state.auth);

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

  return (
    <Spin spinning={loading}>
      <Layout className="min-h-screen">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
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
                  src={
                    currentUser.avatarUrl || (
                      <AvatarPlaceHolder className="!w-8 !h-8" />
                    )
                  }
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
    </Spin>
  );
};

export default AdminLayout;
