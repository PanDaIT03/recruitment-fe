import { Avatar, Dropdown, MenuProps } from 'antd';
import { Dispatch, memo, SetStateAction, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { AvatarPlaceHolder } from '~/assets/svg';
import { useAppSelector } from '~/hooks/useStore';
import { token } from '~/utils/constant';
import icons from '~/utils/icons';
import { createBaseMenu, createUserMenu } from './menu/headerMenuItem';

const { LogoutOutlined } = icons;

interface IProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const HeaderDropDown = ({ setIsOpen }: IProps) => {
  const navigate = useNavigate();

  const { currentUser } = useAppSelector((state) => state.auth);

  const userMenu = createUserMenu(navigate);
  const baseMenu = createBaseMenu({ currentUser, token });

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
  }, [baseMenu, userMenu]);

  return (
    <>
      <Dropdown arrow trigger={['click']} menu={{ items: menuItems }}>
        <Avatar
          alt="avatar"
          src={
            currentUser?.avatarUrl || (
              <AvatarPlaceHolder className="!w-14 !h-14" />
            )
          }
          className="!w-10 !h-10 border-gray-200 border cursor-pointer"
        />
      </Dropdown>
    </>
  );
};

export default memo(HeaderDropDown);
