import { Menu, ModalProps } from 'antd';
import { Dispatch, memo, SetStateAction, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '~/components/Button/Button';
import Modal from '~/components/Modal/Modal';
import { useAppSelector } from '~/hooks/useStore';
import useToken from '~/hooks/useToken';
import {
  commonMenuItems,
  createBaseMenu,
  createGuestMenu,
  createUserMenu,
} from './menu/headerMenuItem';

interface IProps extends ModalProps {
  isOpen: boolean;
  onSingOut: () => void;
  setIsOpenMenuModal: Dispatch<SetStateAction<boolean>>;
}

const HeaderModal = ({
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

  const guestMenu = createGuestMenu({
    currentUser,
    refreshToken,
    onNavigate: handleNavigate,
    onSignOut: handleSignOut,
  });

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
      ...guestMenu,
    ],
    [baseMenu, commonMenu, userMenu, guestMenu]
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

export default memo(HeaderModal);
