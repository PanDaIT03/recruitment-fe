import { Col, Image, Row, Space, Tag } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FilterAdmin } from '~/assets/svg';
import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import Content from '~/components/Content/Content';
import Table from '~/components/Table/Table';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import usePagination from '~/hooks/usePagination';
import useQueryParams from '~/hooks/useQueryParams';
import { useAppSelector } from '~/hooks/useStore';
import { getAllUserAdmin } from '~/store/thunk/userAdmin';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import UserFilter from './UserFilter';

const { EyeOutlined, EditOutlined } = icons;

const UserManagement: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const queryParams = useQueryParams();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const { userAdmin, loading } = useAppSelector((state) => state.userAdmin);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const paginationParams = {
    page: Number(queryParams.get('page') || 1),
    pageSize: Number(queryParams.get('pageSize') || 10),
  };

  const { currentPage, itemsPerPage, handlePageChange } = usePagination({
    items: userAdmin.items,
    fetchAction: getAllUserAdmin,
    pageInfo: {
      currentPage: paginationParams.page,
      itemsPerPage: paginationParams.pageSize,
      totalItems: userAdmin.pageInfo.totalItems,
    },
  });

  useEffect(() => {
    setTitle('Danh sách người dùng');
    setBreadcrumb([{ title: 'Quản lý' }, { title: 'Danh sách người dùng' }]);
  }, []);

  const columns = useMemo(() => {
    return [
      {
        width: 50,
        title: 'STT',
        dataIndex: 'id',
        render: (_: any, __: any, index: number) =>
          index + 1 + paginationParams.pageSize * (paginationParams.page - 1),
      },
      {
        width: 150,
        dataIndex: 'fullName',
        title: 'Tên người dùng',
      },
      {
        width: 200,
        title: 'Email',
        dataIndex: 'email',
      },
      {
        width: 150,
        align: 'center',
        title: 'Hình ảnh',
        dataIndex: 'avatarUrl',
        render: (avatar: string) => (
          <Image
            width={50}
            height={50}
            src={avatar}
            className="shadow-lg rounded-full"
          />
        ),
      },
      {
        width: 200,
        title: 'Lĩnh vực công việc',
        dataIndex: 'usersJobFields',
        render: (value) =>
          value?.length
            ? value?.map((item: any) => item?.jobField?.title)?.join(', ')
            : '-',
      },
      {
        width: 100,
        title: 'Quyền',
        dataIndex: ['role', 'title'],
        className: 'capitalize',
      },
      {
        width: 150,
        title: 'Trạng thái',
        dataIndex: 'isActive',
        render: (isActive: boolean) =>
          isActive ? (
            <Tag color="green">Hoạt động</Tag>
          ) : (
            <Tag color="red">Bị chặn</Tag>
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
        fixed: 'right',
        align: 'center',
        title: 'Thao tác',
        render: (record: any) => (
          <Space>
            <ButtonAction title={<EditOutlined />} tooltipTitle="Chỉnh sửa" />
            <ButtonAction
              title={<EyeOutlined />}
              tooltipTitle="Xem chi tiết"
              onClick={() =>
                navigate(PATH.ADMIN_USER_DETAIL, { state: record })
              }
            />
          </Space>
        ),
      },
    ] as ColumnsType<any>;
  }, [paginationParams]);

  const handleFilter = useCallback((values: any) => {
    console.log('filter', values);
  }, []);

  const handleCancelFilter = useCallback(() => {
    console.log('cancel');
    setIsOpenFilter(false);
  }, []);

  return (
    <>
      <Row align="middle" justify="end">
        <Col>
          <Button
            title={<FilterAdmin />}
            className="bg-white"
            onClick={() => setIsOpenFilter((prev) => !prev)}
          />
        </Col>
      </Row>
      <UserFilter
        form={form}
        open={isOpenFilter}
        onFinish={handleFilter}
        onCancel={handleCancelFilter}
      />
      <Content>
        <Table
          columns={columns}
          loading={loading}
          dataSource={userAdmin.items}
          pagination={{
            current: currentPage,
            pageSize: itemsPerPage,
            total: userAdmin?.pageInfo?.totalItems,
            onChange: handlePageChange,
          }}
        />
      </Content>
    </>
  );
};

export default UserManagement;
