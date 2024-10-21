import { googleLogout } from '@react-oauth/google';
import { Dropdown, Image, MenuProps } from 'antd';
import { memo, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DISCONNECTED, USER_AVATAR } from '~/assets/img';
import {
  DualLayerFile,
  File,
  PersonCard,
  SkyScraper,
  UserAccount,
} from '~/assets/svg';
import Button from '~/components/Button/Button';
import Modal from '~/components/Modal/Modal';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { signOut } from '~/store/thunk/auth';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { CloseOutlined, LogoutOutlined } = icons;

const HeaderDropDown = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAppSelector((state) => state.auth);

  const handleCancelModal = () => {
    setIsOpen(false);
  };

  const handleOkModal = () => {
    googleLogout();

    dispatch(signOut()).then(() => {
      setIsOpen(false);
      navigate(PATH.ROOT);
    });
  };

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
      ...(currentUser?.role?.id === 1
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
      { type: 'divider' as const },
      {
        key: 'logout',
        className: 'hover:!bg-light-warning',
        icon: <LogoutOutlined className="text-warning" />,
        label: <span className="text-warning font-medium">Đăng xuất</span>,
        onClick: () => setIsOpen(true),
      },
    ];
  }, []);

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
      <Modal
        isOpen={isOpen}
        title="Đăng xuất"
        animationType="slide-down"
        onCancel={handleCancelModal}
        footer={
          <div className="flex justify-end gap-3">
            <Button
              title="Huỷ"
              iconBefore={<CloseOutlined />}
              className="w-full max-w-[143px]"
              onClick={handleCancelModal}
            />
            <Button
              fill
              title="Đăng xuất"
              iconAfter={<LogoutOutlined />}
              className="w-full max-w-[143px]"
              onClick={handleOkModal}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center gap-3">
          <Image width={112} height={112} preview={false} src={DISCONNECTED} />
          <p className="text-center font-semibold text-[#334155]">
            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình?
          </p>
        </div>
      </Modal>
    </>
  );
};

export default memo(HeaderDropDown);
