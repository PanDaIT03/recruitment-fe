import { Flex } from 'antd';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Spin from '~/components/Loading/Spin';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import { TAB_ITEM_KEY } from '~/enums';
import useQueryParams from '~/hooks/useQueryParams';
import { useAppSelector } from '~/hooks/useStore';
import Role from './Role/Role';
import UserList from './UserList/UserList';

interface ITabItems {
  key: string;
  label: string;
}

const tabItems: ITabItems[] = [
  {
    key: TAB_ITEM_KEY.USER,
    label: 'Danh sách người dùng',
  },
  {
    key: TAB_ITEM_KEY.ROLE,
    label: 'Vai trò người dùng',
  },
];

const UserPermission = () => {
  const navigate = useNavigate();
  const { searchParams } = useQueryParams();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const firstRender = useRef<boolean>(true);

  const { loading } = useAppSelector((state) => state.auth);
  const activedTab = useMemo(() => searchParams?.tab, [searchParams]);

  useEffect(() => {
    setTitle('Danh sách người dùng');
    setBreadcrumb([{ title: 'Cài đặt' }, { title: 'Phân quyền' }]);
  }, []);

  useEffect(() => {
    setTitle(
      activedTab === TAB_ITEM_KEY.USER
        ? 'Danh sách người dùng'
        : 'Danh sách chức vụ'
    );

    if (!firstRender.current) return;

    navigate(`?tab=${activedTab || TAB_ITEM_KEY.USER}`);
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
      {activedTab === TAB_ITEM_KEY.USER ? <UserList /> : <Role />}
    </Spin>
  );
};

export default UserPermission;
