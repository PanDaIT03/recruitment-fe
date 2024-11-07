import { Flex, Menu, ModalProps, Space } from 'antd';
import { Dispatch, memo, SetStateAction, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AddUser,
  AvatarPlaceHolder,
  BackPack,
  Blogs,
  DualLayerFile,
  File,
  PersonCard,
  SkyScraper,
  UserAccount,
  Users,
} from '~/assets/svg';
import Button from '~/components/Button/Button';
import Modal from '~/components/Modal/Modal';
import { useAppSelector } from '~/hooks/useStore';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

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

  const handleNavigate = useCallback(async (path: string) => {
    setIsOpenMenuModal(false);
    await new Promise((resolve) => setTimeout(resolve, 0));

    navigate(path);
  }, []);

  const userMenu = useMemo(() => {
    return [
      ...(currentUser?.role?.id === 2
        ? [
            {
              key: 'admin-menu',
              label: (
                <span className="text-neutral-600 font-medium">Admin</span>
              ),
              onClick: () => handleNavigate(PATH.ADMIN_DASHBOARD),
            },
          ]
        : currentUser?.role?.id === 1
          ? [
              {
                key: 'profile-group',
                type: 'group' as const,
                className: '[&>div]:!text-[#1c1917]',
                label: <span className="font-semibold">Hồ sơ</span>,
                children: [
                  {
                    key: '1',
                    label: (
                      <span className="text-neutral-600 font-medium">
                        Cá nhân
                      </span>
                    ),
                    icon: <PersonCard width={18} height={18} />,
                    onClick: () => handleNavigate(PATH.USER_PROFILE),
                  },
                  {
                    key: '2',
                    label: (
                      <span className="text-neutral-600 font-medium">
                        Công việc mong muốn
                      </span>
                    ),
                    icon: <DualLayerFile width={18} height={18} />,
                    onClick: () => handleNavigate(PATH.USER_DESIRED_JOB),
                  },
                  {
                    key: '3',
                    label: (
                      <span className="text-neutral-600 font-medium">CV</span>
                    ),
                    icon: <File width={16} height={16} />,
                  },
                ],
              },
              { type: 'divider' as const },
              {
                key: 'work-group',
                className: '[&>div]:!text-[#1c1917]',
                label: <span className="font-semibold">Công việc</span>,
                type: 'group' as const,
                children: [
                  {
                    key: '4',
                    label: (
                      <span className="text-neutral-600 font-medium">
                        Doanh nghiệp tiếp cận
                      </span>
                    ),
                    icon: <SkyScraper width={18} height={18} />,
                  },
                ],
              },
              { type: 'divider' as const },
              {
                key: '5',
                label: (
                  <span className="text-neutral-600 font-medium">
                    Tài khoản
                  </span>
                ),
                icon: <UserAccount width={18} height={18} />,
                onClick: () => handleNavigate(PATH.USER_ACCOUNT),
              },
            ]
          : [
              {
                key: '1',
                label: (
                  <span className="text-neutral-600 font-medium">
                    Dashboard
                  </span>
                ),
                onClick: () => handleNavigate(PATH.EMPLOYER_DASHBOARD),
              },
              {
                key: '2',
                label: (
                  <span className="text-neutral-600 font-medium">Đăng tin</span>
                ),
                onClick: () => handleNavigate(PATH.EMPLOYER_POSTING),
              },
            ]),
      { type: 'divider' as const, dashed: true },
      {
        key: 'logout',
        className: 'hover:!bg-light-warning',
        icon: <LogoutOutlined className="!text-warning" />,
        label: <span className="text-warning font-medium">Đăng xuất</span>,
        onClick: onSingOut,
      },
    ];
  }, [currentUser]);

  const guestMenu = useMemo(() => {
    return [
      {
        key: 'profile-group',
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
        key: 'profile-group',
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
      { type: 'divider' as const },
      ...(refreshToken ? userMenu : guestMenu),
    ];
  }, [userMenu, guestMenu, onSingOut]);

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
        {refreshToken && (
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
