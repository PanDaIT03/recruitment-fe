import { Col, ConfigProvider, Menu, MenuProps, Row } from 'antd';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';
import { memo, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { HeaderLogo } from '~/assets/svg';
import Button from '~/components/Button/Button';
import { useAppSelector } from '~/hooks/useStore';
import PATH from '~/utils/path';
import HeaderDropDown from './HeaderDropDown';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
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

const selectedKeys = [
  PATH.JOB_LIST,
  PATH.JOB_SEEKER,
  // [PATH.BLOG]
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { refreshToken } = useAppSelector((state) => state.auth.currentUser);

  const getSelectedKey = useCallback((path: string) => {
    return Object.values(selectedKeys).filter((key) => key === path);
  }, []);

  const handleSelect = useCallback((selectInfo: any) => {
    const { key } = selectInfo;
    navigate(key);
  }, []);

  const menuItems: ItemType<MenuItemType>[] = useMemo(
    () =>
      items.map((item) => {
        const { ...rest } = item;

        return {
          ...rest,
          style: {
            width: 'max-content',
            overflow: 'inherit',
            padding: '0 8px',
          },
        };
      }),
    []
  );

  return (
    <div className="sticky bg-secondary px-8 left-0 top-0 z-40">
      <Row align={'middle'} justify={'space-between'} className="h-16 mx-12">
        <Col className="flex flex-1 justify-between gap-x-12">
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
        )}
      </Row>
    </div>
  );
};

export default memo(Header);
