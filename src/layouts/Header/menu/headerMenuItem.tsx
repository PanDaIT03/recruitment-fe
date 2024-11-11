import { Avatar, Flex } from 'antd';

import {
  AddUser,
  AvatarPlaceHolder,
  DualLayerFile,
  File,
  PersonCard,
  SkyScraper,
  UserAccount,
} from '~/assets/svg';
import useRole from '~/hooks/useRole';
import { IUser } from '~/types/Auth';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { LoginOutlined } = icons;

interface IBaseMenu {
  currentUser: IUser;
  refreshToken: string | null;
}

export const createUserMenu = (navigate: (path: string) => void) => {
  const { isGuest, isAdmin, isEmployer, isUser } = useRole();

  return [
    ...(isAdmin
      ? [
          {
            key: 'admin-menu',
            label: <span className="text-neutral-600 font-medium">Admin</span>,
            onClick: () => navigate(PATH.ADMIN_DASHBOARD),
          },
        ]
      : isUser
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
                  onClick: () => navigate(PATH.USER_PROFILE),
                },
                {
                  key: '2',
                  label: (
                    <span className="text-neutral-600 font-medium">
                      Công việc mong muốn
                    </span>
                  ),
                  icon: <DualLayerFile width={18} height={18} />,
                  onClick: () => navigate(PATH.USER_DESIRED_JOB),
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
            { type: 'divider' as const, dashed: true },
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
            { type: 'divider' as const, dashed: true },
            {
              key: '5',
              label: (
                <span className="text-neutral-600 font-medium">Tài khoản</span>
              ),
              icon: <UserAccount width={18} height={18} />,
              onClick: () => navigate(PATH.USER_ACCOUNT),
            },
          ]
        : isEmployer
          ? [
              {
                key: '1',
                label: (
                  <span className="text-neutral-600 font-medium">
                    Tổng quan
                  </span>
                ),
                onClick: () => navigate(PATH.EMPLOYER_DASHBOARD),
              },
              {
                key: '2',
                label: (
                  <span className="text-neutral-600 font-medium">Ứng viên</span>
                ),
                onClick: () => navigate(PATH.EMPLOYER_CANDICATES_DASHBOARD),
              },
              {
                key: '3',
                label: (
                  <span className="text-neutral-600 font-medium">Đăng tin</span>
                ),
                onClick: () => navigate(PATH.EMPLOYER_POSTING),
              },
              {
                key: '4',
                label: (
                  <span className="text-neutral-600 font-medium">
                    Tuyển dụng
                  </span>
                ),
                onClick: () => navigate(PATH.EMPLOYER_RECRUITMENT_LIST),
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
                onClick: () => navigate(PATH.EMPLOYER_PERSONAL),
              },
            ]
          : isGuest
            ? [
                {
                  key: 'user-group',
                  type: 'group' as const,
                  className: '[&>div]:!text-[#1c1917]',
                  label: <span className="font-semibold">Người tìm việc</span>,
                  children: [
                    {
                      key: '1',
                      label: (
                        <span className="text-neutral-600 font-medium">
                          Đăng nhập
                        </span>
                      ),
                      icon: <LoginOutlined />,
                      onClick: () => navigate(PATH.USER_SIGN_IN),
                    },
                    {
                      key: '2',
                      label: (
                        <span className="text-neutral-600 font-medium">
                          Đăng ký tìm việc
                        </span>
                      ),
                      icon: <AddUser width={18} height={18} />,
                      onClick: () => navigate(PATH.USER_SIGN_UP),
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
                      key: '3',
                      label: (
                        <span className="text-neutral-600 font-medium">
                          Đăng nhập
                        </span>
                      ),
                      icon: <LoginOutlined />,
                      onClick: () => navigate(PATH.EMPLOYER_SIGN_IN),
                    },
                    {
                      key: '4',
                      label: (
                        <span className="text-neutral-600 font-medium">
                          Đăng ký tuyển dụng
                        </span>
                      ),
                      icon: <AddUser width={18} height={18} />,
                      onClick: () => navigate(PATH.EMPLOYER_SIGN_UP),
                    },
                  ],
                },
              ]
            : []),
  ];
};

export const createBaseMenu = ({ currentUser, refreshToken }: IBaseMenu) => {
  return !!refreshToken && !!Object.keys(currentUser).length
    ? [
        {
          key: 'base',
          className: 'pointer-events-none !p-0 !h-max',
          label: (
            <Flex gap={16} align="center" className="w-full rounded-md p-3">
              <Avatar
                src={
                  currentUser?.avatarUrl || (
                    <AvatarPlaceHolder className="!w-14 !h-14 !border-none cursor-pointer" />
                  )
                }
                alt="avatar"
                className="!w-14 !h-14 border border-slate-400"
              />
              <div>
                <p className="text-lg font-bold">{currentUser.fullName}</p>
                <p className="text-sub text-md">{currentUser.email}</p>
              </div>
            </Flex>
          ),
        },
      ]
    : [];
};
