import { Flex, Layout, Menu, MenuProps } from 'antd';
import classNames from 'classnames';
import { Dispatch, memo, SetStateAction } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  BriefCase,
  Dashboard,
  EditStreamline,
  HeaderLogoPrimary,
} from '~/assets/svg';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import './index.scss';

interface IProps {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

const { Sider } = Layout;
const { SettingOutlined } = icons;

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
    key: 'recruitment',
    label: 'Tuyển dụng',
    icon: <BriefCase />,
    children: [
      {
        key: PATH.ADMIN_JOB_MANAGEMENT,
        label: 'Công việc',
      },
      {
        key: PATH.ADMIN_DESIRED_JOB_MANAGEMENT,
        label: 'Hồ sơ ứng viên',
      },
    ],
  },
  {
    key: 'approve',
    label: 'Phê duyệt',
    icon: <EditStreamline />,
    children: [
      {
        key: '',
        label: 'Phê duyệt hồ sơ',
      },
    ],
  },
  {
    key: 'system',
    label: 'Hệ thống',
    icon: <SettingOutlined />,
    children: [
      {
        key: PATH.ADMIN_PERMISSION,
        label: 'Phân quyền',
      },
      {
        key: PATH.ADMIN_FUNCTIONAL_MANAGEMENT,
        label: 'Danh sách chức năng',
      },
      {
        key: PATH.ADMIN_MENU_MANAGEMENT,
        label: 'Quản lý Menu/Menu group',
      },
    ],
  },
] as MenuProps['items'];

const selectedKeys = [
  [PATH.ADMIN_DASHBOARD],
  [PATH.ADMIN_JOB_MANAGEMENT],
  [PATH.ADMIN_FUNCTIONAL_MANAGEMENT],
  [
    PATH.ADMIN_PERMISSION,
    PATH.ADMIN_PERMISSION_USER_DETAIL,
    PATH.ADMIN_PERMISSION_ROLE_DETAIL,
  ],
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
