import { Card, Table } from 'antd';
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

const Recruitment: React.FC = () => {
  const { data: applicationJobs } = useFetch<Application>(
    ['JobsApplicants'],
    JobsAPI.getAllJobsApplicants
  );

  const currentPage = applicationJobs?.pageInfo?.currentPage || 1;
  const pageSize = applicationJobs?.pageInfo?.itemsPerPage || 10;

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

export default Recruitment;
