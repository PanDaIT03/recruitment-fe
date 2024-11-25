import { Avatar, Flex } from 'antd';

import {
  AddUser,
  AvatarPlaceHolder,
  Community,
  DualLayerFile,
  File,
  PersonCard,
  SkyScraper,
  UserAccount,
  Users,
  Work,
} from '~/assets/svg';
import useRole from '~/hooks/useRole';
import { IUser } from '~/types/Auth';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { LoginOutlined, AuditOutlined } = icons;

interface IBaseMenu {
  currentUser: IUser;
  token: string | null;
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
                  key: 'personal',
                  label: (
                    <span className="text-neutral-600 font-medium">
                      Cá nhân
                    </span>
                  ),
                  icon: <PersonCard width={18} height={18} />,
                  onClick: () => navigate(PATH.USER_PROFILE),
                },
                {
                  key: 'desired-job',
                  label: (
                    <span className="text-neutral-600 font-medium">
                      Công việc mong muốn
                    </span>
                  ),
                  icon: <DualLayerFile width={18} height={18} />,
                  onClick: () => navigate(PATH.USER_DESIRED_JOB),
                },
                {
                  key: 'cv',
                  label: (
                    <span className="text-neutral-600 font-medium">CV</span>
                  ),
                  icon: <File width={16} height={16} />,
                  onClick: () => navigate(PATH.USER_RESUME),
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
                  key: 'applied-jobs',
                  label: (
                    <span className="text-neutral-600 font-medium">
                      Công việc đã ứng tuyển
                    </span>
                  ),
                  icon: <AuditOutlined width={18} height={18} />,
                  onClick: () => navigate(PATH.USER_APPLIED_JOB),
                },
                {
                  key: 'business-approach',
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
              key: 'user-account',
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
                key: 'overview',
                label: (
                  <span className="text-neutral-600 font-medium">
                    Tổng quan
                  </span>
                ),
                icon: <SkyScraper width={18} height={18} />,
                onClick: () => navigate(PATH.EMPLOYER_DASHBOARD),
              },
              {
                key: 'candidate',
                label: (
                  <span className="text-neutral-600 font-medium">Ứng viên</span>
                ),
                icon: <Community width={18} height={18} />,
                onClick: () => navigate(PATH.EMPLOYER_CANDICATES_DASHBOARD),
              },
              {
                key: 'post-job',
                label: (
                  <span className="text-neutral-600 font-medium">Đăng tin</span>
                ),
                icon: <Work width={18} height={18} />,

                onClick: () => navigate(PATH.EMPLOYER_POSTING),
              },
              {
                key: 'recruitment',
                label: (
                  <span className="text-neutral-600 font-medium">
                    Tuyển dụng
                  </span>
                ),
                icon: <Users width={18} height={18} />,
                onClick: () => navigate(PATH.EMPLOYER_RECRUITMENT),
              },
              { type: 'divider' as const },
              {
                key: 'employer-account',
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
                      key: 'user-sign-in',
                      label: (
                        <span className="text-neutral-600 font-medium">
                          Đăng nhập
                        </span>
                      ),
                      icon: <LoginOutlined />,
                      onClick: () => navigate(PATH.USER_SIGN_IN),
                    },
                    {
                      key: 'user-sign-up',
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
                      key: 'employer-sign-in',
                      label: (
                        <span className="text-neutral-600 font-medium">
                          Đăng nhập
                        </span>
                      ),
                      icon: <LoginOutlined />,
                      onClick: () => navigate(PATH.USER_SIGN_IN),
                    },
                    {
                      key: 'employer-sign-up',
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

export const createBaseMenu = ({ currentUser, token }: IBaseMenu) => {
  return !!token && !!Object.keys(currentUser).length
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
};
