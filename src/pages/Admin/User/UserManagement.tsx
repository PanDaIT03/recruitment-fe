import { Avatar, Popconfirm, Space, Tag, Tooltip } from 'antd';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import UserApi from '~/apis/user';
import Button from '~/components/Button/Button';
import Content from '~/components/Content/Content';
import Table from '~/components/Table/Table';
import { useFetch } from '~/hooks/useFetch';
import useQueryParams from '~/hooks/useQueryParams';
import { UserListResponse } from '~/types/User';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { UserOutlined, EyeOutlined, EditOutlined } = icons;

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const queryParams = useQueryParams();

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

  const columns = useMemo(() => {
    return [
      {
        title: 'STT',
        dataIndex: 'id',
        render: (_: any, __: any, index: number) =>
          index + 1 + paginationParams.pageSize * (paginationParams.page - 1),
      },
      {
        dataIndex: 'fullName',
        title: 'Tên người dùng',
        className: 'font-bold',
      },
      {
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
        title: 'Email',
        dataIndex: 'email',
      },
      {
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
        title: 'Quyền',
        dataIndex: ['role', 'title'],
        className: 'capitalize',
      },
      {
        title: 'Hành động',
        key: 'actions',
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
    ];
  }, [paginationParams]);

  return (
    <Content>
      <Table
        columns={columns}
        dataSource={sorttedUserById}
        rowKey={(record) => record?.id}
        pagination={{ pageSize: 10 }}
      />
    </Content>
  );
};

export default UserManagement;
