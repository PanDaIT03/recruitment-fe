import { Flex, Layout, Menu, MenuProps } from 'antd';
import classNames from 'classnames';
import { Dispatch, memo, SetStateAction } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Dashboard, HeaderLogoPrimary, List } from '~/assets/svg';
import PATH from '~/utils/path';
import './index.scss';

interface IProps {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

const { Sider } = Layout;

const MENU_ITEMS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <Dashboard />,
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
    icon: <List />,
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

const selectedKeys = [
  [PATH.ADMIN_DASHBOARD],
  [PATH.ADMIN_JOB_MANAGEMENT],
  [PATH.ADMIN_FUNCTIONAL_MANAGEMENT],
  [PATH.ADMIN_FUNCTIONAL_GROUP_MANAGEMENT],
  [PATH.ADMIN_USER_MANAGEMENT, PATH.ADMIN_USER_DETAIL],
  [PATH.ADMIN_ROLE_MANAGEMENT, PATH.ADMIN_DETAIL_ROLE_MANAGEMENT],
];

const Sidebar = ({ collapsed, setCollapsed }: IProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = (pathname: string) => {
    for (const keys of selectedKeys) if (keys.includes(pathname)) return keys;

    return [pathname];
  };

  return (
    <Sider
      width={250}
      collapsible
      theme="light"
      trigger={null}
      collapsed={collapsed}
      className="drop-shadow-lg"
      onCollapse={(value) => setCollapsed(value)}
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
        className="custome-menu"
        selectedKeys={getSelectedKey(location.pathname)}
        defaultOpenKeys={location?.state?.key ? [location?.state?.key] : []}
        onSelect={(e) =>
          navigate(e?.key, {
            state: { key: e?.key, parentKey: e?.keyPath?.[1] },
          })
        }
      />
    </Sider>
  );
};

export default memo(Sidebar);
