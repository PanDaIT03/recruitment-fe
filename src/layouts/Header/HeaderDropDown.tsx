import { Dropdown, Image, MenuProps } from 'antd';
import { Dispatch, memo, SetStateAction, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { USER_AVATAR } from '~/assets/img';
import {
  DualLayerFile,
  File,
  PersonCard,
  SkyScraper,
  UserAccount,
} from '~/assets/svg';
import { useAppSelector } from '~/hooks/useStore';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { LogoutOutlined } = icons;

interface IProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const HeaderDropDown = ({ setIsOpen }: IProps) => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.auth);

  const baseMenu: MenuProps['items'] = useMemo(() => {
    return [
      {
        key: 'base',
        className: 'pointer-events-none',
        label: (
          <div>
            <h1 className="font-semibold">{currentUser.fullName}</h1>
            <span className="text-sm text-gray-600">{currentUser.email}</span>
          </div>
        ),
        icon: (
          <Image
            width={40}
            height={40}
            preview={false}
            src={USER_AVATAR}
            className="border border-white rounded-[50%] select-none"
          />
        ),
      },
      { type: 'divider' },
    ];
  }, [currentUser]);

  const menuItems: MenuProps['items'] = useMemo(() => {
    return [
      ...baseMenu,
      ...(currentUser?.role?.id === 2
        ? [
            {
              key: 'admin-menu',
              label: (
                <span className="text-neutral-600 font-medium">Admin</span>
              ),
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
                onClick: () => navigate(PATH.USER_ACCOUNT),
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
      { type: 'divider' as const },
      {
        key: 'logout',
        className: 'hover:!bg-light-warning',
        icon: <LogoutOutlined className="text-warning" />,
        label: <span className="text-warning font-medium">Đăng xuất</span>,
        onClick: () => setIsOpen(true),
      },
    ];
  }, [baseMenu, currentUser, navigate]);

  return (
    <>
      <Dropdown arrow trigger={['click']} menu={{ items: menuItems }}>
        <a onClick={(e) => e.preventDefault()}>
          <Image
            width={40}
            height={40}
            preview={false}
            src={USER_AVATAR}
            className="border border-white rounded-[50%] text-"
          />
        </a>
      </Dropdown>
    </>
  );
};

export default memo(HeaderDropDown);
