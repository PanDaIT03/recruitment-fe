import { Menu, ModalProps } from 'antd';
import {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { BackPack, Blogs, Users } from '~/assets/svg';
import Button from '~/components/Button/Button';
import Modal from '~/components/Modal/Modal';
import { useAppSelector } from '~/hooks/useStore';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import { createBaseMenu, createUserMenu } from './menu/headerMenuItem';

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

  const { currentUser } = useAppSelector((state) => state.auth);
  const [navigatePath, setNavigatePath] = useState(location.pathname);

  const refreshToken = localStorage.getItem('token2');

  const isAuthenticated = useMemo(
    () => !!refreshToken && !!Object.keys(currentUser).length,
    [refreshToken, currentUser]
  );

  const handleNavigate = useCallback((path: string) => {
    setNavigatePath(path);
    setIsOpenMenuModal(false);
  }, []);

  const handleSignOut = useCallback(() => {
    setIsOpenMenuModal(false);
    onSingOut();
  }, []);

  const handleModalClose = () => {
    if (navigatePath === location.pathname) return;

    navigate(navigatePath);
    setNavigatePath(navigatePath);
  };

  const userMenu = createUserMenu(handleNavigate);
  const baseMenu = createBaseMenu({ currentUser, token: refreshToken });

  const menuItems = useMemo(() => {
    return [
      ...baseMenu,
      {
        key: 'job-seeker',
        label: (
          <span className="text-neutral-600 font-medium">
            Danh sách ứng viên
          </span>
        ),
        icon: <Users width={18} height={18} />,
        onClick: () => handleNavigate(PATH.JOB_SEEKER),
      },
      {
        key: 'job-list',
        label: (
          <span className="text-neutral-600 font-medium">Tin tuyển dụng</span>
        ),
        icon: <BackPack width={18} height={18} />,

        onClick: () => handleNavigate(PATH.JOB_LIST),
      },
      {
        key: 'blog',
        label: <span className="text-neutral-600 font-medium">Blog</span>,
        icon: <Blogs width={18} height={18} />,
        onClick: () => handleNavigate('/'),
      },
      { type: 'divider' as const, dashed: true },
      ...userMenu,
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
    ];
  }, [baseMenu, userMenu, isAuthenticated, currentUser]);

  return (
    <Modal
      centered
      destroyOnClose
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
