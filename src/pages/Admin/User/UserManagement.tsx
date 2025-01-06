import { Avatar, Col, Popconfirm, Row, Space, Tag, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import UserApi from '~/apis/user';
import { FilterAdmin } from '~/assets/svg';
import Button from '~/components/Button/Button';
import Content from '~/components/Content/Content';
import Table from '~/components/Table/Table';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import { useFetch } from '~/hooks/useFetch';
import useQueryParams from '~/hooks/useQueryParams';
import { UserListResponse } from '~/types/User';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import UserFilter from './UserFilter';

const { UserOutlined, EyeOutlined, EditOutlined } = icons;

const UserManagement: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const queryParams = useQueryParams();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const { data: allUser } = useFetch<UserListResponse>(
    ['allUsers'],
    UserApi.getAllUser
  );

  const paginationParams = {
    page: Number(queryParams.get('page') || 1),
    pageSize: Number(queryParams.get('pageSize') || 10),
  };

  const sorttedUserById = useMemo(
    () => allUser?.items?.sort((a, b) => a.id - b.id),
    [allUser]
  );

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
        width: 150,
        title: 'Hình ảnh',
        dataIndex: 'avatar',
        render: (avatar: string) => (
          <Avatar
            className="shadow-lg"
            icon={<UserOutlined />}
            src={avatar}
            size="large"
          />
        ),
      },
      {
        width: 200,
        title: 'Email',
        dataIndex: 'email',
      },
      {
        width: 150,
        title: 'Trạng thái',
        dataIndex: 'isActive',
        render: (isActive: boolean) =>
          isActive ? (
            <Tag color="orange">Hoạt động</Tag>
          ) : (
            <Tag color="red">Bị chặn</Tag>
          ),
      },
      {
        width: 100,
        title: 'Quyền',
        dataIndex: ['role', 'title'],
        className: 'capitalize',
      },
      {
        key: 'actions',
        fixed: 'right',
        align: 'center',
        title: 'Thao tác',
        render: (record: any) => (
          <Space>
            <Popconfirm title="Bạn chắc chắn rằng muốn chặn người dùng này?">
              <Button title={<EditOutlined />} />
            </Popconfirm>
            <Tooltip title="Xem chi tiết">
              <Button
                fill
                title={<EyeOutlined />}
                onClick={() =>
                  navigate(PATH.ADMIN_USER_DETAIL, { state: record })
                }
              />
            </Tooltip>
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
          dataSource={sorttedUserById}
          rowKey={(record) => record?.id}
          pagination={{ pageSize: 10 }}
        />
      </Content>
    </>
  );
};

export default UserManagement;
