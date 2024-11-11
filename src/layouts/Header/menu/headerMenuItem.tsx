import {
  DualLayerFile,
  File,
  PersonCard,
  SkyScraper,
  UserAccount,
} from '~/assets/svg';
import { IUser } from '~/types/Auth';
import PATH from '~/utils/path';

interface ICreateUserMenu {
  currentUser: IUser;
  navigate: (path: string) => void;
}

export const createUserMenu = ({ currentUser, navigate }: ICreateUserMenu) => [
  ...(currentUser?.role?.id === 2
    ? [
        {
          key: 'admin-menu',
          label: <span className="text-neutral-600 font-medium">Admin</span>,
          onClick: () => navigate(PATH.ADMIN_DASHBOARD),
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
                  <span className="text-neutral-600 font-medium">Cá nhân</span>
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
                label: <span className="text-neutral-600 font-medium">CV</span>,
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
              <span className="text-neutral-600 font-medium">Tài khoản</span>
            ),
            icon: <UserAccount width={18} height={18} />,
            onClick: () => navigate(PATH.USER_ACCOUNT),
          },
        ]
      : [
          {
            key: '1',
            label: (
              <span className="text-neutral-600 font-medium">Dashboard</span>
            ),
            onClick: () => navigate(PATH.EMPLOYER_DASHBOARD),
          },
          {
            key: '2',
            label: (
              <span className="text-neutral-600 font-medium">Đăng tin</span>
            ),
            onClick: () => navigate(PATH.EMPLOYER_POSTING),
          },
        ]),
];
