import { MenuOutlined } from '@ant-design/icons';
import { googleLogout } from '@react-oauth/google';
import { Col, Divider, Dropdown, Image, Menu, Modal, Row } from 'antd';
import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DISCONNECTED, USER_AVATAR } from '~/assets/img';
import { Down, HeaderLogo } from '~/assets/svg';
import Button from '~/components/Button/Button';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { signOut } from '~/store/thunk/auth';
import PATH from '~/utils/path';
import HeaderDropDown from './HeaderDropDown';
import type { MenuProps } from 'antd';

interface IMenuItems {
  href: string;
  label: string;
  active: boolean;
  children?: IMenuItems[];
}

const menuItems: IMenuItems[] = [
  { label: 'Tổng quan', href: PATH.EMPLOYER_DASHBOARD, active: true },
  {
    label: 'Ứng viên',
    href: PATH.EMPLOYER_CANDICATES_DASHBOARD,
    active: false,
    children: [
      {
        label: 'Tổng quan',
        href: PATH.EMPLOYER_CANDICATES_DASHBOARD,
        active: false,
      },
      {
        label: 'Quản lý',
        href: PATH.EMPLOYER_CANDICATES_MANAGEMENT,
        active: false,
      },
      {
        label: 'Thêm mới',
        href: PATH.EMPLOYER_CANDICATES_ADDNEW,
        active: false,
      },
    ],
  },
  {
    label: 'Công việc',
    href: PATH.EMPLOYER_POSTING,
    active: false,
    children: [
      {
        label: 'Quản lý',
        href: PATH.EMPLOYER_RECRUITMENT_LIST,
        active: false,
      },
      {
        label: 'Đăng tin',
        href: PATH.EMPLOYER_POSTING,
        active: false,
      },
    ],
  },
  { label: 'Tuyển dụng', href: PATH.EMPLOYER_RECRUITMENT, active: false },
];

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);

  const [isMenuModalOpen, setMenuModalOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  const toggleMenuModal = () => setMenuModalOpen((prev) => !prev);
  const toggleLogoutModal = () => setLogoutModalOpen((prev) => !prev);

  const handleLogout = useCallback(() => {
    googleLogout();
    dispatch(signOut()).then(() => {
      setLogoutModalOpen(false);
      navigate(PATH.ROOT);
    });
  }, [dispatch, navigate]);

  const convertToMenuItems = (
    items: IMenuItems[],
    onClick?: () => void
  ): MenuProps['items'] => {
    return items.map((item, index) => {
      if (item.children) {
        return {
          key: `${index}`,
          label: (
            <span
              className={`w-full flex items-center gap-2 p-2 text-center font-bold rounded-md hover:bg-header-bgHover hover:text-main cursor-pointer ${
                item.active ? 'bg-header-active' : ''
              }`}
            >
              {item.label} <Down />
            </span>
          ),
          children: item.children.map((child, childIndex) => ({
            key: `${index}-${childIndex}`,
            label: (
              <Link
                to={child.href}
                className="p-2 w-full text-center font-bold rounded-md hover:bg-header-bgHover hover:text-white"
                onClick={onClick}
              >
                {child.label}
              </Link>
            ),
          })),
        };
      }

      return {
        key: `${index}`,
        label: (
          <Link
            to={item.href}
            className={`w-full p-2 text-center font-bold rounded-md hover:bg-header-bgHover hover:!text-white ${
              item.active ? 'bg-header-active text-white' : ''
            }`}
            onClick={onClick}
          >
            {item.label}
          </Link>
        ),
      };
    });
  };

  const renderDesktopMenu = () => (
    <div className="hidden md:flex text-main text-sm gap-x-4">
      {menuItems.map((item, index) => {
        if (item.children) {
          return (
            <Dropdown
              trigger={['click']}
              key={index}
              menu={{ items: convertToMenuItems(item.children) }}
              placement="bottomLeft"
            >
              <span
                className={`flex items-center gap-2 p-2 text-center font-bold rounded-md hover:bg-header-bgHover hover:text-main cursor-pointer ${
                  item.active ? 'bg-header-active' : ''
                }`}
              >
                {item.label} <Down />
              </span>
            </Dropdown>
          );
        }

        return (
          <Link
            key={index}
            to={item.href}
            className={`p-2 text-center font-bold rounded-md hover:bg-header-bgHover hover:text-main ${
              item.active ? 'bg-header-active text-white' : ''
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="sticky bg-secondary left-0 top-0 z-40">
      <Row
        align="middle"
        justify="space-between"
        className="h-16 mx-16 flex-wrap md:flex-nowrap"
      >
        <Col className="hidden md:flex justify-between gap-x-12 w-full md:w-auto">
          <HeaderLogo
            className="max-w-[139px] h-full cursor-pointer"
            onClick={() => navigate(PATH.ROOT)}
          />
          {renderDesktopMenu()}
        </Col>

        <Col className="md:hidden flex justify-between items-center w-full">
          <MenuOutlined
            className="text-main text-xl"
            onClick={toggleMenuModal}
          />
          <Modal
            open={isMenuModalOpen}
            onCancel={toggleMenuModal}
            footer={null}
            closable={false}
            className="w-full max-w-xs mx-auto"
          >
            <div className="flex gap-2">
              <Image
                width={40}
                height={40}
                preview={false}
                src={USER_AVATAR}
                className="border border-white rounded-full"
              />
              <div className="flex flex-col">
                <h1 className="font-semibold">{currentUser.fullName}</h1>
                <span className="text-sm text-gray-600">
                  {currentUser.email}
                </span>
              </div>
            </div>
            <Divider />
            <Menu
              items={convertToMenuItems(menuItems, toggleMenuModal)}
              mode="vertical"
            />
            <Divider />
            <div className="flex flex-col gap-2">
              <Button
                title="Đăng xuất"
                onClick={handleLogout}
                fill
                className="w-full"
              />
              <Button
                title="Đóng"
                onClick={toggleMenuModal}
                className="w-full"
              />
            </div>
          </Modal>

          <Modal
            open={isLogoutModalOpen}
            onCancel={toggleLogoutModal}
            footer={null}
            closable={false}
            className="w-full"
          >
            <div className="text-center">
              <div className="flex flex-col items-center gap-3">
                <Image
                  width={112}
                  height={112}
                  preview={false}
                  src={DISCONNECTED}
                />
                <p className="font-semibold text-[#334155]">
                  Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình?
                </p>
              </div>
              <div className="flex justify-center mt-6">
                <Button
                  onClick={toggleLogoutModal}
                  className="mr-2"
                  title="Hủy"
                />
                <Button title="Đăng xuất" fill onClick={handleLogout} />
              </div>
            </div>
          </Modal>
        </Col>

        <div className="hidden md:block">
          <HeaderDropDown setIsOpen={setLogoutModalOpen} />
        </div>
      </Row>
    </div>
  );
};

export default Header;
