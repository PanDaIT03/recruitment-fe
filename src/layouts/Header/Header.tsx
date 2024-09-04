import { Col, Row } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { HeaderLogo } from '~/assets/svg';

import Button from '~/components/Button/Button';
import PATH from '~/utils/path';

interface IMenuItems {
  label: string;
  href: string;
}

const menuItems: IMenuItems[] = [
  {
    label: 'Danh sách ứng viên',
    href: '',
  },
  {
    label: 'Tin tuyển dụng',
    href: '',
  },
  {
    label: 'Blog',
    href: '',
  },
];

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#692474] px-8">
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
                className="p-2 text-center font-bold rounded-md hover:bg-header-bgHover hover:text-main"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </Col>
        <Col className="flex gap-3 justify-between items-center relative">
          <Button
            displayType="text"
            className="hover:bg-header-bgHover"
            onClick={() => navigate(PATH.SIGNIN)}
            title={
              <div className="flex flex-col text-start">
                <span className="text-xs">Người tìm việc</span>
                <span className="text-sm">Đăng ký/ Đăng nhập</span>
              </div>
            }
          />
          <hr className="border-l-[1px]	border-main h-7" />
          <Button fill title="Nhà tuyển dụng" />
        </Col>
      </Row>
    </div>
  );
};

export default Header;
