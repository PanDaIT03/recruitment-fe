import { Col, ConfigProvider, Dropdown, Menu, MenuProps, Row } from 'antd';
import { memo, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { HeaderLogo } from '~/assets/svg';
import Button from '~/components/Button/Button';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import HeaderDropDown from './HeaderDropDown';

export type MenuItem = { key: string } & Required<MenuProps>['items'][number];

interface IProps {
  items?: MenuItem[];
}

const { LoginOutlined, UserAddOutlined } = icons;

const defaultItems: MenuItem[] = [
  {
    key: PATH.JOB_SEEKER,
    label: 'Danh sách ứng viên',
  },
  {
    key: PATH.JOB_LIST,
    label: 'Tin tuyển dụng',
  },
  {
    key: 'blog',
    label: 'Blog',
  },
];

const Header = ({ items = defaultItems }: IProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const refreshToken = localStorage.getItem('token2');

  const menuItems: MenuItem[] = useMemo(
    () =>
      items.map((item) => {
        const { ...others } = item;

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

  return (
    <div className="sticky bg-secondary px-8 left-0 top-0 z-40">
      <Row align="middle" justify="space-between" className="h-16 mx-12">
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
              className="flex w-full"
              onSelect={handleSelect}
              selectedKeys={getSelectedKey(location.pathname)}
            />
          </ConfigProvider>
        </Col>

        {refreshToken ? (
          <HeaderDropDown />
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
      </Row>
    </div>
  );
};

export default memo(Header);
