import { Col, Form, Row, Space, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FilterAdmin } from '~/assets/svg';
import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import Content from '~/components/Content/Content';
import Table from '~/components/Table/Table';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import usePagination from '~/hooks/usePagination';
import { useAppSelector } from '~/hooks/useStore';
import { getAllRoles } from '~/store/thunk/role';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import RoleFilter from './RoleFilter';

const { Text } = Typography;
const { PlusOutlined, EditOutlined } = icons;

const RoleManagement = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const { roles, loading } = useAppSelector((state) => state.role);

  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [filterParams, setFilterParams] = useState({} as any);

  const { items, pageInfo, handlePageChange } = usePagination({
    items: roles.items,
    fetchAction: getAllRoles,
    extraParams: filterParams,
    setFilterParams: setFilterParams,
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
          (pageInfo.page - 1) * pageInfo.pageSize + index + 1,
      },
      {
        width: 100,
        title: 'Tên chức vụ',
        dataIndex: 'title',
        render: (value: string) => <Text className="capitalize">{value}</Text>,
      },
      {
        width: 250,
        title: 'Mô tả chức vụ',
        dataIndex: 'description',
      },
      {
        width: 250,
        title: 'Chức năng',
        dataIndex: 'rolesFunctionals',
        render: (value) => (
          <p className="line-clamp-2">
            {value?.map((item: any) => item?.functional?.title)?.join(', ')}
          </p>
        ),
      },
      {
        width: 180,
        title: 'Người tạo',
        dataIndex: ['creator', 'fullName'],
      },
      {
        width: 200,
        title: 'Ngày tạo',
        dataIndex: 'createAt',
        render: (value: string) =>
          value ? dayjs(value).format('DD/MM/YYYY HH:MM') : '-',
      },
      {
        width: 180,
        title: 'Người chỉnh sửa',
        dataIndex: ['updater', 'fullName'],
      },
      {
        width: 200,
        title: 'Ngày chỉnh sửa',
        dataIndex: 'updateAt',
        render: (value: string) =>
          value ? dayjs(value).format('DD/MM/YYYY HH:MM') : '-',
      },
      {
        width: 100,
        key: 'actions',
        fixed: 'right',
        align: 'center',
        title: 'Thao tác',
        render: (_, record) => (
          <Space align="center">
            <ButtonAction
              tooltipTitle="Chỉnh sửa"
              title={<EditOutlined />}
              onClick={() =>
                navigate(
                  `${PATH.ADMIN_DETAIL_ROLE_MANAGEMENT}?id=${record?.id}`
                )
              }
            />
          </Space>
        ),
      },
    ] as ColumnsType<any>;
  }, [pageInfo]);

  const handleOnFilterButtonClick = useCallback(() => {
    setIsOpenFilter((prev) => !prev);
  }, []);

  const handleCancelFilter = useCallback(() => {
    setFilterParams({});
  }, []);

  const handleFinishFilter = useCallback((params: any) => {
    setFilterParams({
      title: params?.title,
      functionalIds: params?.functionalIds,
    });
  }, []);

  return (
    <>
      <Row gutter={[8, 16]} align={'middle'} justify={'end'}>
        <Col>
          <Button
            title={<FilterAdmin />}
            className="bg-white"
            onClick={handleOnFilterButtonClick}
          />
        </Col>
        <Col>
          <Button
            fill
            title="Tạo"
            iconBefore={<PlusOutlined />}
            onClick={() => navigate(PATH.ADMIN_DETAIL_ROLE_MANAGEMENT)}
          />
        </Col>
      </Row>
      <RoleFilter
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
            current: pageInfo.page,
            pageSize: pageInfo.pageSize,
            total: roles.pageInfo?.totalItems,
            onChange: handlePageChange,
          }}
        />
      </Content>
    </>
  );
};

export default memo(RoleManagement);
