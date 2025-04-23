import { Flex } from 'antd';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Spin from '~/components/Loading/Spin';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import { FUNCTIONAL_TAB_ITEM_KEY } from '~/enums';
import useQueryParams from '~/hooks/useQueryParams';
import { useAppSelector } from '~/hooks/useStore';
import { ITabItems } from '../Permission/Permission';
import Functional from './Functional/Functional';
import FunctionalGroup from './FunctionalGroup/FunctionalGroup';

const tabItems: ITabItems[] = [
  {
    key: FUNCTIONAL_TAB_ITEM_KEY.FUNCTIONAL_GROUP,
    label: 'Danh sách nhóm chức năng',
  },
  {
    key: FUNCTIONAL_TAB_ITEM_KEY.FUNCTIONAL,
    label: 'Danh sách chức năng',
  },
];

const FunctionalManagement = () => {
  const navigate = useNavigate();
  const { searchParams } = useQueryParams();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const firstRender = useRef<boolean>(true);

  const { loading } = useAppSelector((state) => state.auth);
  const activedTab = useMemo(() => searchParams?.tab, [searchParams]);

  useEffect(() => {
    setTitle('Danh sách chức năng');
    setBreadcrumb([{ title: 'Cài đặt' }, { title: 'Danh sách chức năng' }]);
  }, []);

  useEffect(() => {
    setTitle(
      activedTab === FUNCTIONAL_TAB_ITEM_KEY.FUNCTIONAL_GROUP
        ? 'Danh sách nhóm chức năng'
        : 'Danh sách chức năng'
    );

    if (!firstRender.current) return;

    navigate(`?tab=${activedTab || FUNCTIONAL_TAB_ITEM_KEY.FUNCTIONAL_GROUP}`);
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
      {activedTab === FUNCTIONAL_TAB_ITEM_KEY.FUNCTIONAL_GROUP ? (
        <FunctionalGroup />
      ) : (
        <Functional />
      )}
    </Spin>
  );
};

export default FunctionalManagement;
