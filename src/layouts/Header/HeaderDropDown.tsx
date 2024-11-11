import { Dropdown, Image, MenuProps } from 'antd';
import { Dispatch, memo, SetStateAction, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { USER_AVATAR } from '~/assets/img';
import { useAppSelector } from '~/hooks/useStore';
import icons from '~/utils/icons';
import { createUserMenu } from './menu/headerMenuItem';

const { LogoutOutlined } = icons;

interface IProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const HeaderDropDown = ({ setIsOpen }: IProps) => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.auth);

  const userMenu = createUserMenu({ currentUser, navigate });

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
      ...userMenu,
      { type: 'divider' as const },
      {
        key: 'logout',
        className: 'hover:!bg-light-warning',
        icon: <LogoutOutlined className="text-warning" />,
        label: <span className="text-warning font-medium">Đăng xuất</span>,
        onClick: () => setIsOpen(true),
      },
    ];
  }, [baseMenu, userMenu, currentUser, navigate]);

  return (
    <>
      <Dropdown arrow trigger={['click']} menu={{ items: menuItems }}>
        <a onClick={(e) => e.preventDefault()}>
          <Image
            width={40}
            height={40}
            preview={false}
            src={USER_AVATAR}
            className="border border-white rounded-[50%] text-"
          />
        </a>
      </Dropdown>
    </>
  );
};

export default memo(HeaderDropDown);
