import { googleLogout } from '@react-oauth/google';
import {
  Col,
  ConfigProvider,
  Dropdown,
  Image,
  Menu,
  MenuProps,
  Row,
} from 'antd';
import { memo, ReactNode, useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { DISCONNECTED } from '~/assets/img';
import { BackPack, Blogs, HeaderLogo, MenuIcon, Users } from '~/assets/svg';
import Button from '~/components/Button/Button';
import Modal from '~/components/Modal/Modal';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { signOut } from '~/store/thunk/auth';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import HeaderDropDown from './HeaderDropDown';
import HeaderMenu from './HeaderMenu';

export type MenuItem = { key: string } & Required<MenuProps>['items'][number];

export type IMenuItem = {
  icon?: ReactNode;
} & MenuItem;

interface IProps {
  items?: IMenuItem[];
}

const defaultItems: IMenuItem[] = [
  {
    key: PATH.JOB_SEEKER,
    label: 'Danh sách ứng viên',
    icon: <Users width={18} height={18} />,
  },
  {
    key: PATH.JOB_LIST,
    label: 'Tin tuyển dụng',
    icon: <BackPack width={18} height={18} />,
  },
  {
    key: 'blog',
    label: 'Blog',
    icon: <Blogs width={18} height={18} />,
  },
];

const { LoginOutlined, UserAddOutlined, CloseOutlined, LogoutOutlined } = icons;

const Header = ({ items = defaultItems }: IProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const refreshToken = localStorage.getItem('token2');
  const { currentUser, loading } = useAppSelector((state) => state.auth);

  const [isOpenMenuModal, setIsOpenMenuModal] = useState(false);
  const [isOpenLogOutModal, setIsOpenLogOutModal] = useState(false);

  const isAuthenticated = useMemo(
    () => !!refreshToken && !!Object.keys(currentUser).length,
    [refreshToken, currentUser]
  );

  const menuItems: IMenuItem[] = useMemo(
    () =>
      items.map((item) => {
        const { icon, ...others } = item;

        return {
          ...others,
          style: {
            fontWeight: 600,
            width: 'max-content',
            overflow: 'inherit',
            padding: '0 8px',
          },
        };
      }),
    [items]
  );

  const userMenuItems: MenuProps['items'] = useMemo(() => {
    return [
      {
        key: 0,
        label: 'Đăng nhập',
        icon: <LoginOutlined className="w-4 h-4" />,
        className: 'hover:!text-main hover:!bg-bright-orange !font-medium',
        onClick: () => navigate(PATH.USER_SIGN_IN),
      },
      {
        key: 1,
        label: 'Đăng ký tìm việc',
        icon: <UserAddOutlined className="w-4 h-4" />,
        className: 'hover:!text-main hover:!bg-bright-orange !font-medium',
        onClick: () => navigate(PATH.USER_SIGN_UP),
      },
    ];
  }, [navigate]);

  const employerMenuItems: MenuProps['items'] = useMemo(() => {
    return [
      {
        key: 0,
        label: 'Đăng nhập',
        icon: <LoginOutlined className="w-4 h-4" />,
        className: 'hover:!text-main hover:!bg-bright-orange !font-medium',
        onClick: () => navigate(PATH.EMPLOYER_SIGN_IN),
      },
      {
        key: 1,
        label: 'Đăng ký tuyển dụng',
        icon: <UserAddOutlined className="w-4 h-4" />,
        className: 'hover:!text-main hover:!bg-bright-orange !font-medium',
        onClick: () => navigate(PATH.EMPLOYER_SIGN_UP),
      },
    ];
  }, [navigate]);

  const getSelectedKey = useCallback(
    (path: string) => {
      const selectedKey = menuItems.filter((item) => item.key === path);
      return selectedKey.map((item) => item.key);
    },
    [menuItems]
  );

  const handleSelect = useCallback((selectInfo: any) => {
    const { key } = selectInfo;
    navigate(key);
  }, []);

  const handleOkModal = useCallback(() => {
    googleLogout();

    dispatch(signOut()).then(() => {
      setIsOpenLogOutModal(false);
      navigate(PATH.ROOT);
    });
  }, []);

  return (
    <div className="sticky bg-secondary px-8 left-0 top-0 z-40">
      <Row align="middle" justify="space-between" className="h-16 lg:mx-12">
        <Col className="flex flex-1 justify-between items-center gap-x-12">
          <HeaderLogo
            className="max-w-[139px] h-full object-cover cursor-pointer"
            onClick={() => navigate(PATH.ROOT)}
          />
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  itemColor: '#fff',
                  itemBg: 'transparent',
                  itemHoverColor: '#fff',
                  itemSelectedColor: '#fff',
                  itemHoverBg: '#461A53',
                  itemSelectedBg: '#31123a !important',
                },
              },
            }}
          >
            <Menu
              mode="inline"
              items={menuItems}
              className="flex w-full max-lg:hidden"
              onSelect={handleSelect}
              selectedKeys={getSelectedKey(location.pathname)}
            />
          </ConfigProvider>
        </Col>
        <div className="hidden lg:block">
          {isAuthenticated ? (
            <HeaderDropDown setIsOpen={setIsOpenLogOutModal} />
          ) : (
            <Col className="flex gap-3 justify-between items-center relative">
              <Dropdown trigger={['click']} menu={{ items: userMenuItems }}>
                <Button
                  displayType="text"
                  className="px-3 py-2 hover:bg-header-bgHover"
                  title={
                    <div className="flex flex-col text-start font-semibold">
                      <span className="text-xs">Người tìm việc</span>
                      <span className="text-sm">Đăng ký/ Đăng nhập</span>
                    </div>
                  }
                />
              </Dropdown>
              <hr className="border-l-[1px]	border-main h-7" />
              <Dropdown trigger={['click']} menu={{ items: employerMenuItems }}>
                <Button fill title="Nhà tuyển dụng" />
              </Dropdown>
            </Col>
          )}
        </div>
        <div className="hidden max-lg:block">
          <MenuIcon
            width={28}
            height={28}
            className="text-white cursor-pointer"
            onClick={() => setIsOpenMenuModal(true)}
          />
          <HeaderMenu
            isOpen={isOpenMenuModal}
            onSingOut={handleOkModal}
            setIsOpenMenuModal={setIsOpenMenuModal}
          />
        </div>
        <Modal
          title="Đăng xuất"
          isOpen={isOpenLogOutModal}
          animationType="slide-down"
          onCancel={() => setIsOpenLogOutModal(false)}
          footer={
            <div className="flex justify-end gap-3">
              <Button
                title="Huỷ"
                loading={loading}
                iconBefore={<CloseOutlined />}
                className="w-full max-w-[143px]"
                onClick={() => setIsOpenLogOutModal(false)}
              />
              <Button
                fill
                title="Đăng xuất"
                loading={loading}
                iconAfter={<LogoutOutlined />}
                className="w-full max-w-[143px]"
                onClick={handleOkModal}
              />
            </div>
          }
        >
          <div className="flex flex-col items-center gap-3">
            <Image
              width={112}
              height={112}
              preview={false}
              src={DISCONNECTED}
            />
            <p className="text-center font-semibold text-[#334155]">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình?
            </p>
          </div>
        </Modal>
      </Row>
    </div>
  );
};

export default memo(Header);
