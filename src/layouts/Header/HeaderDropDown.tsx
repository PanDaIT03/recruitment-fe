import { Dropdown, Image, MenuProps } from 'antd';
import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { USER_AVATAR } from '~/assets/img';
import { useAppSelector } from '~/hooks/useStore';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { ProfileOutlined, SnippetsOutlined, UserOutlined, LogoutOutlined } =
  icons;

const HeaderDropDown = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.auth);

  const baseMenu: MenuProps['items'] = useMemo(() => {
    return [
      {
        key: 'base',
        className: 'pointer-events-none',
        label: (
          <div>
            <h1 className="font-semibold">{currentUser.fullName}</h1>
            <span className="text-sm text-gray-600">{currentUser.email}</span>
          </div>
        ),
        icon: (
          <Image
            width={40}
            height={40}
            preview={false}
            src={USER_AVATAR}
            className="border border-white rounded-[50%] select-none"
          />
        ),
      },
      { type: 'divider' },
    ];
  }, [currentUser]);

  const menuItems: MenuProps['items'] = useMemo(() => {
    return [
      ...baseMenu,
      ...(currentUser.role.id === 1
        ? [
            {
              key: '1',
              label: 'Hồ sơ',
              icon: <ProfileOutlined />,
              onClick: () => navigate(PATH.USER_PROFILE),
            },
            {
              key: '2',
              label: 'CV',
              icon: <SnippetsOutlined />,
              onClick: () => navigate(PATH.ROOT),
            },
            { type: 'divider' as const },
            {
              key: '3',
              label: 'Tài khoản',
              icon: <UserOutlined />,
              onClick: () => navigate(PATH.USER_ACCOUNT),
            },
          ]
        : [
            {
              key: '1',
              label: 'Dashboard',
              onClick: () => navigate(PATH.EMPLOYER_DASHBOARD),
            },
            {
              key: '2',
              label: 'Đăng tin',
              onClick: () => navigate(PATH.EMPLOYER_DASHBOARD),
            },
          ]),
      { type: 'divider' as const },
      {
        key: 'logout',
        className: 'hover:!bg-light-warning',
        icon: <LogoutOutlined className="text-warning" />,
        label: <span className="text-warning">Đăng xuất</span>,
        onClick: () => console.log('logout'),
      },
    ];
  }, []);

  return (
    <Dropdown trigger={['click']} menu={{ items: menuItems }}>
      <a onClick={(e) => e.preventDefault()}>
        <Image
          width={40}
          height={40}
          preview={false}
          src={USER_AVATAR}
          className="border border-white rounded-[50%]"
        />
      </a>
    </Dropdown>
  );
};

export default memo(HeaderDropDown);
