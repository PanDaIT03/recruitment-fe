import { Avatar, Col, Dropdown, MenuProps, Row } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { HeaderLogo } from '~/assets/svg';
import { UserOutlined } from '@ant-design/icons';
import Button from '~/components/Button/Button';
import PATH from '~/utils/path';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';

interface IMenuItems {
  label: string;
  href: string;
}

const menuItems: IMenuItems[] = [
  {
    label: 'Danh sách ứng viên',
    href: '/',
  },
  {
    label: 'Tin tuyển dụng',
    href: '/',
  },
  {
    label: 'Blog',
    href: '/',
  },
];

const Header = () => {
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const token = useAppSelector((state) => state.auth.accessToken);

  const menuUser: MenuProps['items'] = [
    {
      key: '1',
      label: 'Hồ sơ',
      onClick: () => navigate(PATH.USER_PROFILE),
    },
    {
      key: '2',
      label: 'CV',
      onClick: () => navigate(PATH.ROOT),
    },
    { type: 'divider' },
    {
      key: '3',
      label: 'Đăng xuất',
      onClick: () => console.log('logout'),
    },
  ];

  const menuEmployer: MenuProps['items'] = [
    {
      key: '1',
      label: 'Dashboard',
      onClick: () => navigate(PATH.EMPLOYER_DASHBOARD),
    },
    {
      key: '2',
      label: 'Đăng tin',
      onClick: () => navigate(PATH.EMPLOYER_DASHBOARD),
    },
    { type: 'divider' },
    {
      key: '3',
      label: 'Đăng xuất',
      onClick: () => console.log('logout'),
    },
  ];

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
        {token ? (
          <>
            <Col className="flex justify-center items-center gap-2">
              {/* <NotificationComponent userRole="user" /> */}
              {currentUser.role.id === 1 ? (
                <>
                  <Dropdown menu={{ items: menuUser }} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Avatar
                        className="border-white"
                        icon={<UserOutlined />}
                      />
                    </a>
                  </Dropdown>
                </>
              ) : (
                <>
                  <Dropdown menu={{ items: menuEmployer }} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Avatar
                        className="border-white"
                        icon={<UserOutlined />}
                      />
                    </a>
                  </Dropdown>
                </>
              )}
            </Col>
          </>
        ) : (
          <>
            <Col className="flex gap-3 justify-between items-center relative">
              <Button
                displayType="text"
                className="hover:bg-header-bgHover"
                onClick={() => navigate(PATH.SIGN_IN)}
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
          </>
        )}
      </Row>
    </div>
  );
};

export default Header;
