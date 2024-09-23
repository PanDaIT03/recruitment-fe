import { Col, Row } from 'antd';
import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { HeaderLogo } from '~/assets/svg';
import Button from '~/components/Button/Button';
import { useAppSelector } from '~/hooks/useStore';
import PATH from '~/utils/path';
import HeaderDropDown from './HeaderDropDown';

interface IMenuItems {
  href: string;
  label: string;
  active: boolean;
}

const menuItems: IMenuItems[] = [
  {
    label: 'Trang chủ',
    href: PATH.EMPLOYER_DASHBOARD,
    active: true,
  },
  {
    label: 'Ứng viên',
    href: PATH.EMPLOYER_DASHBOARD,
    active: false,
  },
  {
    label: 'Đăng tin',
    href: PATH.EMPLOYER_POSTING,
    active: false,
  },
  {
    label: 'Tuyển dụng',
    href: PATH.EMPLOYER_DASHBOARD,
    active: false,
  },
];

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="sticky bg-secondary px-8 left-0 top-0 z-40">
      <Row align={'middle'} justify={'space-between'} className="h-16 mx-12">
        <Col className="flex justify-between gap-x-12">
          <HeaderLogo
            className="max-w-[139px] h-full object-cover cursor-pointer"
            onClick={() => navigate(PATH.ROOT)}
          />
          <div className="flex text-main text-sm gap-x-4">
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
        <HeaderDropDown />
      </Row>
    </div>
  );
};

export default memo(Header);
