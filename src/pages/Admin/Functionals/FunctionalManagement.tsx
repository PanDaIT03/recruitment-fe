import { Col, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import classNames from 'classnames';
import { memo, useCallback, useMemo, useState } from 'react';

import { FilterAdmin } from '~/assets/svg';
import Button from '~/components/Button/Button';
import Content from '~/components/Content/Content';
import Table from '~/components/Table/Table';
import usePagination from '~/hooks/usePagination';
import useQueryParams from '~/hooks/useQueryParams';
import FilterFunctional from './FilterFunctional';

const FunctionalManagement = () => {
  const queryParams = useQueryParams();

  const paginationParams = {
    page: Number(queryParams.get('page') || 1),
    pageSize: Number(queryParams.get('pageSize') || 10),
  };

  const [isOpenFilter, setIsOpenFilter] = useState(false);

  // const {} = usePagination({
  //   fetchAction: {},
  //   extraParams: {},
  //   pageInfo: {
  //       currentPage: paginationParams.page,
  //       itemsPerPage: paginationParams.pageSize,
  //       totalItems:
  //   },
  // });

  const columns = useMemo(() => {
    return [] as ColumnsType<any>;
  }, []);

  const handleOnFilterButtonClick = useCallback(() => {
    setIsOpenFilter(true);
  }, []);

  return (
    <>
      <Row align={'middle'} justify={'end'}>
        <Col>
          <Button
            title={<FilterAdmin />}
            className={classNames(
              'text-admin-primary border-primary-110 hover:bg-primary-110 hover:text-white',
              isOpenFilter && 'text-white bg-admin-primary'
            )}
            onClick={handleOnFilterButtonClick}
          />
        </Col>
      </Row>
      <FilterFunctional />
      <Content className="!bg-[#2f2f41b3]">
        <Table
          columns={columns}
          dataSource={[]}
          loading={false}
          scroll={{ x: 1800 }}
          //   pagination={{
          //     current: pageInfo?.currentPage,
          //     pageSize: pageInfo?.itemsPerPage,
          //     total: pageInfo?.totalItems,
          //     onChange: handlePageChange,
          //   }}
        />
      </Content>
    </>
  );
};

export default memo(FunctionalManagement);
