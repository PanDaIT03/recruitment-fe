import { Avatar, Flex, MenuProps } from 'antd';
import { ReactNode, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AddUser,
  AvatarPlaceHolder,
  BackPack,
  Blogs,
  Users,
} from '~/assets/svg';
import { useAppSelector } from '~/hooks/useStore';
import { IUser } from '~/types/User';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import HeaderMenuIcon from './HeaderMenuIcon';

interface IBaseMenu {
  currentUser: IUser;
  token: string | null;
}

export type MenuItem = {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  path: string;
} & Required<MenuProps>['items'][number];

interface IGuestMenuProps {
  currentUser: IUser;
  refreshToken: string | null;
  onNavigate: (path: string) => void;
  onSignOut: () => void;
}

const { LoginOutlined, LogoutOutlined } = icons;

export const commonMenuItems: MenuItem[] = [
  {
    key: PATH.JOB_SEEKER,
    label: 'Danh sách ứng viên',
    icon: <Users width={18} height={18} />,
    path: PATH.JOB_SEEKER,
  },
  {
    key: PATH.JOB_LIST,
    label: 'Tin tuyển dụng',
    icon: <BackPack width={18} height={18} />,
    path: PATH.JOB_LIST,
  },
  {
    key: 'blog',
    label: 'Blog',
    icon: <Blogs width={18} height={18} />,
    path: '/',
  },
];

export const createGuestMenu = ({
  currentUser,
  refreshToken,
  onNavigate,
  onSignOut,
}: IGuestMenuProps) => {
  const isAuthenticated = !!refreshToken && !!Object.keys(currentUser).length;

  return isAuthenticated
    ? [
        { type: 'divider' as const, dashed: true },
        {
          key: 'logout',
          className: 'hover:!bg-light-warning',
          icon: <LogoutOutlined className="!text-warning" />,
          label: <span className="text-warning font-medium">Đăng xuất</span>,
          onClick: onSignOut,
        },
      ]
    : [
        {
          key: 'user-group',
          type: 'group' as const,
          className: '[&>div]:!text-[#1c1917]',
          label: <span className="font-semibold">Người tìm việc</span>,
          children: [
            {
              key: 'user-sign-in',
              label: (
                <span className="text-neutral-600 font-medium">Đăng nhập</span>
              ),
              icon: <LoginOutlined />,
              onClick: () => onNavigate(PATH.USER_SIGN_IN),
            },
            {
              key: 'user-sign-up',
              label: (
                <span className="text-neutral-600 font-medium">
                  Đăng ký tìm việc
                </span>
              ),
              icon: <AddUser width={18} height={18} />,
              onClick: () => onNavigate(PATH.USER_SIGN_UP),
            },
          ],
        },
        { type: 'divider' as const, dashed: true },
        {
          key: 'employer-group',
          type: 'group' as const,
          className: '[&>div]:!text-[#1c1917]',
          label: <span className="font-semibold">Nhà tuyển dụng</span>,
          children: [
            {
              key: 'employer-sign-in',
              label: (
                <span className="text-neutral-600 font-medium">Đăng nhập</span>
              ),
              icon: <LoginOutlined />,
              onClick: () => onNavigate(PATH.USER_SIGN_IN),
            },
            {
              key: 'employer-sign-up',
              label: (
                <span className="text-neutral-600 font-medium">
                  Đăng ký tuyển dụng
                </span>
              ),
              icon: <AddUser width={18} height={18} />,
              onClick: () => onNavigate(PATH.EMPLOYER_SIGN_UP),
            },
          ],
        },
      ];
};

export const createBaseMenu = ({ currentUser, token }: IBaseMenu) =>
  !!token && !!Object.keys(currentUser).length
    ? [
        {
          key: 'base',
          className: 'pointer-events-none !p-0 !h-max',
          label: (
            <Flex gap={16} align="center" className="w-full rounded-md p-3">
              <Avatar
                alt="avatar"
                className="!w-14 !h-14 border-gray-200 border"
                src={
                  currentUser?.avatarUrl || (
                    <AvatarPlaceHolder className="!w-14 !h-14" />
                  )
                }
              />
              <div className="leading-6">
                <p className="text-lg font-bold">{currentUser.fullName}</p>
                <p className="text-sub text-md">{currentUser.email}</p>
              </div>
            </Flex>
          ),
        },
      ]
    : [];

export const createUserMenu = (): MenuProps['items'] => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.auth);

  const { viewGroups, standaloneViews } = currentUser;

  const childrenRender = useCallback(
    (menuView: any) => ({
      key: menuView.id,
      icon: (
        <HeaderMenuIcon iconType={menuView.iconType} icon={menuView.icon} />
      ),
      label: (
        <span className="text-neutral-600 font-medium">{menuView.title}</span>
      ),
      onClick: () => navigate(menuView.path),
    }),
    []
  );

  const menuViewGroups: MenuProps['items'] = useMemo(
    () =>
      viewGroups?.map((viewGroup, index) => ({
        key: index,
        type: 'group' as const,
        className: '[&>div]:!text-[#1c1917]',
        label: <span className="font-semibold">{viewGroup?.title}</span>,
        children: viewGroup?.menuViews?.map((menuView) =>
          childrenRender(menuView)
        ),
      })),
    [viewGroups]
  );

  const menuStandaloneViews: MenuProps['items'] = useMemo(
    () =>
      standaloneViews?.map((standaloneViews) =>
        childrenRender(standaloneViews)
      ) || [],
    [standaloneViews]
  );

  const menuWithDivider = useMemo(() => {
    const formattedMenuViewGroups = menuViewGroups || [];
    const formattedMenuStandaloneViews = menuStandaloneViews || [];

    return [
      ...formattedMenuViewGroups,
      ...formattedMenuStandaloneViews,
    ]?.flatMap((menuItem, index, arr) => {
      if (index < arr.length - 1)
        return [menuItem, { type: 'divider' as const, dashed: true }];
      return menuItem;
    });
  }, [menuViewGroups, menuStandaloneViews]);

  return menuWithDivider;
};
