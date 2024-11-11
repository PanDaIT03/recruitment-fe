import { ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Table } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { JobsAPI } from '~/apis/job';
import { useFetch } from '~/hooks/useFetch';
import { Application } from '~/types/Job';
import icons from '~/utils/icons';

import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'react-router-dom';
dayjs.extend(relativeTime);
dayjs.locale('vi');

const { FilePdfOutlined } = icons;

const CandicateDashboard: React.FC = () => {
  const { data: applicationJobs } = useFetch<Application>(
    ['JobsApplicants'],
    JobsAPI.getAllJobsApplicants
  );

  const currentPage = applicationJobs?.pageInfo?.currentPage || 1;
  const pageSize = applicationJobs?.pageInfo?.itemsPerPage || 10;

  const stats = [
    { title: 'Số lượng ứng viên mới', value: 0 },
    { title: 'Ứng viên tự ứng tuyển', value: 0 },
    { title: 'Ứng viên được chia sẻ', value: 0 },
    { title: 'Ứng viên từ nguồn khác', value: 0 },
  ];

  const columns = [
    {
      title: 'STT',
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'applicationStatus',
    },
    {
      title: 'Ứng viên',
      dataIndex: ['user', 'fullName'],
    },
    {
      title: 'Vị trí tuyển dụng',
      dataIndex: ['job'],
      render: (value: { id: number; title: string }) => (
        <Link to={`/job/${value.id}`}>{value.title}</Link>
      ),
    },
    {
      title: 'Ngày ứng tuyển',
      dataIndex: 'createAt',
      render: (value: string) => (
        <>
          <p>{dayjs(value).format('DD/MM/YYYY')}</p>
          <p>{dayjs(value).fromNow()}</p>
        </>
      ),
    },
    {
      title: 'Ngày cập nhật',
      render: (record: Application['items'][0]) =>
        dayjs(
          !record.employerUpdateAt ? record.createAt : record.employerUpdateAt
        ).format('DD/MM/YYYY'),
    },
    {
      title: 'Hành động',
      render: () => <FilePdfOutlined className="cursor-pointer" />,
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
        <Table
          columns={columns}
          dataSource={applicationJobs?.items}
          className="mb-4"
        />
      </Card>
    </div>
  );
};

export default CandicateDashboard;
