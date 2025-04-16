import { Menu, ModalProps } from 'antd';
import { Dispatch, memo, SetStateAction, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '~/components/Button/Button';
import Modal from '~/components/Modal/Modal';
import { useAppSelector } from '~/hooks/useStore';
import useToken from '~/hooks/useToken';
import icons from '~/utils/icons';
import {
  commonMenuItems,
  createBaseMenu,
  createUserMenu,
} from './menu/headerMenuItem';

interface IProps extends ModalProps {
  isOpen: boolean;
  onSingOut: () => void;
  setIsOpenMenuModal: Dispatch<SetStateAction<boolean>>;
}

const { LogoutOutlined } = icons;

const HeaderMenu = ({
  isOpen,
  onSingOut,
  setIsOpenMenuModal,
  ...props
}: IProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshToken } = useToken();

  const { currentUser } = useAppSelector((state) => state.auth);
  const [navigatePath, setNavigatePath] = useState(location.pathname);

  const isAuthenticated = !!refreshToken && !!Object.keys(currentUser).length;

  const handleNavigate = (path: string) => {
    setNavigatePath(path);
    setIsOpenMenuModal(false);
  };

  const handleSignOut = () => {
    setIsOpenMenuModal(false);
    onSingOut();
  };

  const handleModalClose = () => {
    if (navigatePath === location.pathname) return;

    navigate(navigatePath);
    setNavigatePath(navigatePath);
  };

  const userMenu = createUserMenu();
  const baseMenu = createBaseMenu({ currentUser, token: refreshToken });
  const commonMenu = useMemo(
    () =>
      commonMenuItems.map((menuItem) => ({
        ...menuItem,
        label: (
          <span className="text-neutral-600 font-medium">{menuItem.label}</span>
        ),
        onClick: () => handleNavigate(menuItem.path),
      })),
    [commonMenuItems]
  );

  const menuItems = useMemo(
    () => [
      ...baseMenu,
      ...commonMenu,
      { type: 'divider' as const, dashed: true },
      ...(userMenu || []),
      ...(isAuthenticated
        ? [
            { type: 'divider' as const, dashed: true },
            {
              key: 'logout',
              className: 'hover:!bg-light-warning',
              icon: <LogoutOutlined className="!text-warning" />,
              label: (
                <span className="text-warning font-medium">Đăng xuất</span>
              ),
              onClick: handleSignOut,
            },
          ]
        : []),
    ],
    [baseMenu, commonMenu, userMenu, isAuthenticated]
  );

  return (
    <Modal
      centered
      isOpen={isOpen}
      className="rounded-2xl"
      animationType="slide-down"
      afterClose={handleModalClose}
      onCancel={() => setIsOpenMenuModal(false)}
      footer={
        <Button
          title="Đóng"
          displayType="outline"
          className="w-full"
          onClick={() => setIsOpenMenuModal(false)}
        />
      }
      {...props}
    >
      <Menu items={menuItems} className="!border-none" />
    </Modal>
  );
};

export default memo(HeaderMenu);
