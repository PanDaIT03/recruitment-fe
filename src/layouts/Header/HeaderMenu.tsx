import { Flex, Menu, ModalProps, Space } from 'antd';
import { Dispatch, memo, SetStateAction, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AddUser,
  AvatarPlaceHolder,
  BackPack,
  Blogs,
  Users,
} from '~/assets/svg';
import Button from '~/components/Button/Button';
import Modal from '~/components/Modal/Modal';
import { useAppSelector } from '~/hooks/useStore';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import { createUserMenu } from './menu/headerMenuItem';

interface IProps extends ModalProps {
  isOpen: boolean;
  onSingOut: () => void;
  setIsOpenMenuModal: Dispatch<SetStateAction<boolean>>;
}

const { LogoutOutlined, LoginOutlined } = icons;

const HeaderMenu = ({
  isOpen,
  onSingOut,
  setIsOpenMenuModal,
  ...props
}: IProps) => {
  const navigate = useNavigate();

  const refreshToken = localStorage.getItem('token2');
  const { currentUser } = useAppSelector((state) => state.auth);

  const isAuthenticated = useMemo(
    () => !!refreshToken && !!Object.keys(currentUser).length,
    [refreshToken, currentUser]
  );

  const handleNavigate = useCallback(async (path: string) => {
    setIsOpenMenuModal(false);
    await new Promise((resolve) => setTimeout(resolve, 0));

    navigate(path);
  }, []);

  const handleSignOut = useCallback(async () => {
    setIsOpenMenuModal(false);
    await new Promise((resolve) => setTimeout(resolve, 0));

    onSingOut();
  }, []);

  const userMenu = createUserMenu({ currentUser, navigate: handleNavigate });

  const baseMenu = useMemo(
    () => [
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
    ],
    []
  );

  const guestMenu = useMemo(() => {
    return [
      {
        key: 'user-group',
        type: 'group' as const,
        className: '[&>div]:!text-[#1c1917]',
        label: <span className="font-semibold">Người tìm việc</span>,
        children: [
          {
            key: '1',
            label: (
              <span className="text-neutral-600 font-medium">Đăng nhập</span>
            ),
            icon: <LoginOutlined />,
            onClick: () => handleNavigate(PATH.USER_SIGN_IN),
          },
          {
            key: '2',
            label: (
              <span className="text-neutral-600 font-medium">
                Đăng ký tìm việc
              </span>
            ),
            icon: <AddUser width={18} height={18} />,
            onClick: () => handleNavigate(PATH.USER_SIGN_UP),
          },
        ],
      },
      { type: 'divider' as const },
      {
        key: 'employer-group',
        type: 'group' as const,
        className: '[&>div]:!text-[#1c1917]',
        label: <span className="font-semibold">Nhà tuyển dụng</span>,
        children: [
          {
            key: '3',
            label: (
              <span className="text-neutral-600 font-medium">Đăng nhập</span>
            ),
            icon: <LoginOutlined />,
            onClick: () => handleNavigate('/'),
          },
          {
            key: '4',
            label: (
              <span className="text-neutral-600 font-medium">
                Đăng ký tuyển dụng
              </span>
            ),
            icon: <AddUser width={18} height={18} />,
            onClick: () => handleNavigate('/'),
          },
        ],
      },
    ];
  }, []);

  const menuItems = useMemo(() => {
    return [
      ...baseMenu,
      { type: 'divider' as const },
      ...(isAuthenticated
        ? [
            ...userMenu,
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
        : guestMenu),
    ];
  }, [userMenu, guestMenu, isAuthenticated, onSingOut]);

  return (
    <Modal
      centered
      isOpen={isOpen}
      className="rounded-2xl"
      animationType="slide-down"
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
      <Space direction="vertical" size="middle" className="w-full">
        {isAuthenticated && (
          <Flex gap={16} align="center" className="w-full rounded-md p-3">
            <AvatarPlaceHolder width={52} height={52} />
            <div>
              <p className="text-lg font-bold">{currentUser.fullName}</p>
              <p className="text-sub text-md">{currentUser.email}</p>
            </div>
          </Flex>
        )}
        <Menu items={menuItems} className="!border-none" />
      </Space>
    </Modal>
  );
};

export default memo(HeaderMenu);
