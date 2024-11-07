import { MenuOutlined } from '@ant-design/icons';
import { googleLogout } from '@react-oauth/google';
import { Col, Divider, Image, Modal, Row } from 'antd';
import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DISCONNECTED, USER_AVATAR } from '~/assets/img';
import { HeaderLogo } from '~/assets/svg';
import Button from '~/components/Button/Button';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { signOut } from '~/store/thunk/auth';
import PATH from '~/utils/path';
import HeaderDropDown from './HeaderDropDown';

interface IMenuItems {
  href: string;
  label: string;
  active: boolean;
}

const menuItems: IMenuItems[] = [
  {
    label: 'Tổng quan',
    href: PATH.EMPLOYER_DASHBOARD,
    active: true,
  },
  {
    label: 'Ứng viên',
    href: PATH.EMPLOYER_CANDICATES_DASHBOARD,
    active: false,
  },
  {
    label: 'Công việc',
    href: PATH.EMPLOYER_POSTING,
    active: false,
  },
  {
    label: 'Tuyển dụng',
    href: PATH.EMPLOYER_RECRUITMENT_LIST,
    active: false,
  },
];

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenH, setIsOpenH] = useState(false);

  const { currentUser } = useAppSelector((state) => state.auth);

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsOpenH(false);
  };

  const handleOkModal = useCallback(() => {
    googleLogout();

    dispatch(signOut()).then(() => {
      setIsOpen(false);
      navigate(PATH.ROOT);
    });
  }, []);

  return (
    <div className="sticky bg-secondary px-8 left-0 top-0 z-40">
      <Row
        align={'middle'}
        justify={'space-between'}
        className="h-16 mx-12 flex-wrap md:flex-nowrap"
      >
        <Col className="hidden md:flex justify-between gap-x-12 w-full md:w-auto">
          <HeaderLogo
            className="max-w-[139px] h-full object-cover cursor-pointer"
            onClick={() => navigate(PATH.ROOT)}
          />
          <div className="hidden md:flex text-main text-sm gap-x-4">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`p-2 text-center font-bold rounded-md hover:bg-header-bgHover hover:text-main ${item.active ? 'bg-header-active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </Col>

        <Col className="md:hidden flex justify-between items-center w-full">
          <MenuOutlined
            className="text-main text-xl"
            onClick={() => setIsOpen(!isOpen)}
          />
          <Modal
            open={isOpen}
            onCancel={handleCloseModal}
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
                className="border border-white rounded-[50%] select-none"
              />
              <div className="flex flex-col">
                <h1 className="font-semibold">{currentUser.fullName}</h1>
                <span className="text-sm text-gray-600">
                  {currentUser.email}
                </span>
              </div>
            </div>
            <Divider />
            <div className="flex flex-col items-center mt-4 ">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={`w-full block p-2 text-center font-bold rounded-md hover:bg-header-bgHover hover:text-main ${item.active ? 'bg-header-active' : ''}`}
                  onClick={handleCloseModal}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Divider />
            <div className="flex flex-col gap-2">
              <Button
                title="Đăng xuất"
                onClick={handleOkModal}
                fill
                className="w-full"
              />
              <Button
                title="Đóng"
                onClick={handleCloseModal}
                className="w-full"
              />
            </div>
          </Modal>

          <Modal
            open={isOpenH}
            onCancel={handleCloseModal}
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
                <p className="text-center font-semibold text-[#334155]">
                  Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình?
                </p>
              </div>
              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleCloseModal}
                  className="mr-2"
                  title="Hủy"
                />

                <Button title="Đăng xuất" fill onClick={handleOkModal} />
              </div>
            </div>
          </Modal>
        </Col>
        <div className="hidden md:block">
          <HeaderDropDown setIsOpen={setIsOpenH} />
        </div>
      </Row>
    </div>
  );
};

export default Header;
