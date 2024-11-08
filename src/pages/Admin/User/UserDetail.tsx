import { Avatar, Card, Descriptions, Divider, Tag, Typography } from 'antd';
import { useLocation } from 'react-router-dom';

const UserDetail = () => {
  const location = useLocation();
  const user = location.state;

  const isEmployer = user?.role?.id === 3;

  return (
    <Card className="max-w-4xl mx-auto p-8 shadow-lg bg-white rounded-lg">
      <div className="flex flex-col md:flex-row items-center mb-8">
        <Avatar
          size={128}
          src={user.avatarUrl || 'https://via.placeholder.com/150'}
          className="mr-8 mb-4 md:mb-0"
        />
        <div className="text-center md:text-left">
          <Typography.Title level={2} className="font-bold">
            {user.fullName}
          </Typography.Title>
          <Typography.Text className="text-gray-500">
            {user.email}
          </Typography.Text>
        </div>
      </div>

      <Divider />

      <Descriptions column={1} bordered className="mb-6">
        <Descriptions.Item label="User ID">{user.id}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {user.phoneNumber || 'N/A'}
        </Descriptions.Item>
        {isEmployer && (
          <>
            <Descriptions.Item label="Tên công ty">
              {user.companyName}
            </Descriptions.Item>
            <Descriptions.Item label="Đường dẫn công ty">
              {user.companyUrl}
            </Descriptions.Item>
            <Descriptions.Item label="Vị trí">
              {user.jobPosition?.title || 'N/A'}
            </Descriptions.Item>
          </>
        )}

        {!isEmployer && (
          <Descriptions.Item label="Lĩnh vực công việc">
            {user?.usersJobFields
              .map((field: any) => field.jobField.title)
              .join(', ') || 'N/A'}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Quyền">
          <Tag color="blue" className="capitalize">
            {user.role?.title || 'Unknown'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={user.isActive ? 'orange' : 'red'}>
            {user.isActive ? 'Hoạt động' : 'Bị chặn'}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      <Divider />
    </Card>
  );
};

export default UserDetail;
