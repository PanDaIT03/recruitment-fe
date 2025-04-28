import { Flex } from 'antd';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Spin from '~/components/Loading/Spin';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import { MENU_MANAGEMENT_TAB_ITEM_KEY } from '~/enums';
import useQueryParams from '~/hooks/useQueryParams';
import { useAppSelector } from '~/hooks/useStore';
import { ITabItems } from '../Permission/Permission';
import Menu from './Menu/Menu';
import MenuGroup from './MenuGroup/MenuGroup';

const tabItems: ITabItems[] = [
  {
    key: MENU_MANAGEMENT_TAB_ITEM_KEY.MENU_GROUP,
    label: 'Danh sách menu group',
  },
  {
    key: MENU_MANAGEMENT_TAB_ITEM_KEY.MENU,
    label: 'Danh sách menu',
  },
];

const MenuManagement = () => {
  const navigate = useNavigate();
  const { searchParams } = useQueryParams();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const firstRender = useRef<boolean>(true);

  const { loading } = useAppSelector((state) => state.auth);
  const activedTab = useMemo(() => searchParams?.tab, [searchParams]);

  useEffect(() => {
    setTitle('Quản lý Menu/Menu group');
    setBreadcrumb([{ title: 'Cài đặt' }, { title: 'Quản lý Menu/Menu group' }]);
  }, []);

  useEffect(() => {
    if (!firstRender.current) return;

    navigate(`?tab=${activedTab || MENU_MANAGEMENT_TAB_ITEM_KEY.MENU_GROUP}`);
    firstRender.current = false;
  }, [activedTab]);

  const handleTabClick = useCallback((key: string) => {
    navigate(`?tab=${key}`);
  }, []);

  return (
    <Spin spinning={loading}>
      <Flex className="w-max bg-white mb-3 rounded-full border border-[#F15227] overflow-hidden">
        {tabItems.map((item, index) => (
          <p
            key={index}
            className={classNames(
              'py-2 px-6 rounded-full cursor-pointer hover:opacity-100 transition-opacity',
              activedTab === item.key ? 'bg-[#F15227] text-white' : 'opacity-60'
            )}
            onClick={() => handleTabClick(item.key)}
          >
            {item.label}
          </p>
        ))}
      </Flex>
      {activedTab === MENU_MANAGEMENT_TAB_ITEM_KEY.MENU ? (
        <Menu />
      ) : (
        <MenuGroup />
      )}
    </Spin>
  );
};

export default MenuManagement;
