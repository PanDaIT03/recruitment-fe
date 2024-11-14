import { ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import relativeTime from 'dayjs/plugin/relativeTime';
import { Calendar, Filter, Hash, User } from '~/assets/svg';
dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Title, Text, Paragraph } = Typography;

const CandicateDashboard: React.FC = () => {
  const stats = [
    { title: 'Số lượng ứng viên mới', value: 0 },
    { title: 'Ứng viên tự ứng tuyển', value: 0 },
    { title: 'Ứng viên được chia sẻ', value: 0 },
    { title: 'Ứng viên từ nguồn khác', value: 0 },
  ];

  const columns = [
    {
      title: () => (
        <span className="flex items-center gap-2">
          <User />
          Ứng viên
        </span>
      ),
      dataIndex: '',
    },
    {
      title: () => (
        <span className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Vị trí tuyển dụng
        </span>
      ),
      dataIndex: '',
    },
    {
      title: () => (
        <span className="flex items-center gap-2">
          <Hash />
          Hashtags
        </span>
      ),
      dataIndex: '',
    },
    {
      title: () => (
        <span className="flex items-center gap-2">
          <Calendar />
          Cập nhật
        </span>
      ),
      dataIndex: '',
    },
  ];

  return (
    <div className="p-6  min-h-screen">
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card className="text-center shadow-md">
              <p className="text-gray-600 mb-2">{stat.title}</p>
              <p className="text-4xl font-bold mb-2">{stat.value}</p>
              <p className="text-green-500 flex items-center justify-center">
                <ArrowUpOutlined />
                <span className="ml-1">+0% so với tháng trước</span>
              </p>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="mt-6 text-center shadow-md">
        <Paragraph className="mb-4">
          <Title level={4}>Ứng tuyển mới nhất</Title>
          <Text className="text-sm text-gray-500">
            Danh sách ứng viên ứng tuyển mới nhất
          </Text>
        </Paragraph>

        <Table columns={columns} dataSource={[]} />
      </Card>
    </div>
  );
};

export default CandicateDashboard;
