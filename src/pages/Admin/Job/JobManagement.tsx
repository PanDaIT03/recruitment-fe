import { Popconfirm, Space, Table } from 'antd';
import React from 'react';
import { JobsAPI } from '~/apis/job';
import Button from '~/components/Button/Button';
import { useFetch } from '~/hooks/useFetch';
import { IJob } from '~/types/Job';

const JobManagement: React.FC = () => {
  const { data: allJobs } = useFetch<IJob>(JobsAPI.getAllJobs);

  const columns = [
    {
      title: 'Tiêu đề công việc',
      dataIndex: 'title',
      className: 'font-bold',
    },
    {
      title: 'Tên công ty',
      dataIndex: ['user', 'companyName'],
    },
    {
      title: 'Vị trí',
      dataIndex: ['jobPosition', 'title'],
    },
    {
      title: 'Số lượng ứng tuyển',
      dataIndex: 'quantity',
    },
    {
      title: 'Hình thức làm việc',
      dataIndex: ['workType', 'title'],
    },
    {
      title: 'Khu vực',
      render: (record: any) =>
        record?.jobsPlacements
          ?.map((item: any) => item?.placement?.title)
          .join(', '),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: () => (
        <Space>
          <Popconfirm title="Are you sure to delete?">
            <Button title="Delete" fill />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-lg">
      <Table
        // loading={loading}
        dataSource={allJobs?.items}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
};

export default JobManagement;
