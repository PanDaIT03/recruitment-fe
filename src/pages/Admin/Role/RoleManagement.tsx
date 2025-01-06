import { Col, Form, Row, Space, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { Edit, FilterAdmin } from '~/assets/svg';
import Button from '~/components/Button/Button';
import Content from '~/components/Content/Content';
import Table from '~/components/Table/Table';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import usePagination from '~/hooks/usePagination';
import useQueryParams from '~/hooks/useQueryParams';
import { useAppSelector } from '~/hooks/useStore';
import { getAllRoles } from '~/store/thunk/role';
import RoleFilterBox from './RoleFilterBox';

const { Text } = Typography;

const RoleManagement = () => {
  const queryParams = useQueryParams(),
    [form] = Form.useForm();

  const { roles, loading } = useAppSelector((state) => state.role);

  const { setTitle } = useTitle(),
    { setBreadcrumb } = useBreadcrumb();

  const [filterParams, setFilterParams] = useState({} as any),
    [isOpenFilter, setIsOpenFilter] = useState(false);

  const paginationParams = {
    page: Number(queryParams.get('page') || 1),
    pageSize: Number(queryParams.get('pageSize') || 10),
  };

  const { currentPage, items, itemsPerPage, pageInfo, handlePageChange } =
    usePagination({
      fetchAction: getAllRoles,
      items: roles.items,
      extraParams: filterParams,
      pageInfo: {
        currentPage: paginationParams?.page,
        itemsPerPage: paginationParams?.pageSize,
        totalItems: roles?.pageInfo?.totalItems ?? 0,
      },
    });

  useEffect(() => {
    setTitle('Danh sách chức vụ');
    setBreadcrumb([{ title: 'Quản lý' }, { title: 'Danh sách chức vụ' }]);
  }, []);

  const columns = useMemo(() => {
    return [
      {
        width: 50,
        title: 'STT',
        render: (_: any, __: any, index: number) =>
          (currentPage - 1) * itemsPerPage + index + 1,
      },
      {
        width: 100,
        title: 'Tên chức vụ',
        dataIndex: 'title',
        render: (value: string) => <Text className="capitalize">{value}</Text>,
      },
      {
        width: 350,
        title: 'Mô tả chức vụ',
        dataIndex: 'description',
      },
      {
        width: 150,
        title: 'Chức năng',
        dataIndex: 'description',
      },
      {
        width: 60,
        key: 'actions',
        fixed: 'right',
        align: 'center',
        title: 'Thao tác',
        render: () => (
          <Space size={'middle'}>
            <Tooltip title="Chỉnh sửa">
              <Button
                className="border-none hover:bg-transparent p-0"
                title={<Edit />}
              />
            </Tooltip>
          </Space>
        ),
      },
    ] as ColumnsType<any>;
  }, [currentPage, itemsPerPage]);

  const handleOnFilterButtonClick = useCallback(() => {
    setIsOpenFilter((prev) => !prev);
  }, []);

  const handleCancelFilter = useCallback(() => {
    setFilterParams({});
  }, []);

  const handleFinishFilter = useCallback((params: any) => {
    setFilterParams({
      id: params?.rolesId,
      functionalIds: params?.functionalIds,
    });
  }, []);

  return (
    <>
      <Row align={'middle'} justify={'end'}>
        <Col>
          <Button
            title={<FilterAdmin />}
            className="bg-white"
            onClick={handleOnFilterButtonClick}
          />
        </Col>
      </Row>
      <RoleFilterBox
        form={form}
        open={isOpenFilter}
        onCancel={handleCancelFilter}
        onFinish={handleFinishFilter}
      />
      <Content>
        <Table
          columns={columns}
          dataSource={items}
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            current: pageInfo?.currentPage,
            pageSize: pageInfo?.itemsPerPage,
            total: pageInfo?.totalItems,
            onChange: handlePageChange,
          }}
        />
      </Content>
    </>
  );
};

export default memo(RoleManagement);
