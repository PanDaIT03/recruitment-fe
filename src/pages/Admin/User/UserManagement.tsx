import { UserOutlined } from '@ant-design/icons';
import { Avatar, Popconfirm, Space, Table, Tag } from 'antd';
import React from 'react';
import UserApi from '~/apis/user';
import Button from '~/components/Button/Button';
import { useFetch } from '~/hooks/useFetch';
import { UserListResponse } from '~/types/User';

const UserManagement: React.FC = () => {
  const { data: allUser, loading } = useFetch<UserListResponse>(
    UserApi.getAllUser
  );

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'fullName',
      key: 'fullName',
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
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Bị chặn</Tag>
        ),
    },
    {
      title: 'Quyền',
      dataIndex: ['role', 'title'],
      className: 'capitalize',
    },
    // {
    //   title: 'Hành động',
    //   key: 'actions',
    //   render: () => (
    //     <Space>
    //       <Popconfirm title="Bạn chắc chắn rằng muốn chặn người dùng này?">
    //         <Button title="Edit" />
    //       </Popconfirm>
    //       <Popconfirm title="Bạn chắc chắn muốn xóa người dùng này?">
    //         <Button title="Delete" fill />
    //       </Popconfirm>
    //     </Space>
    //   ),
    // },
  ];

  const sorttedUserById = allUser?.items.sort((a, b) => a.id - b.id);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <Table
        loading={loading}
        dataSource={sorttedUserById}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default UserManagement;
