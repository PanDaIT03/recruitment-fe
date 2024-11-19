import { Space, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React from 'react';

import { IPaginationParms, JobsAPI } from '~/apis/job';
import { Eye } from '~/assets/svg';
import Button from '~/components/Button/Button';
import Content from '~/components/Content/Content';
import Switch from '~/components/Switch/Switch';
import Table from '~/components/Table/Table';
import { useFetch } from '~/hooks/useFetch';
import { IJobList } from '~/pages/Job/JobList/JobList';
import { IJob } from '~/types/Job';

const JobManagement: React.FC = () => {
  const fetchAllJobs = (params?: IPaginationParms & Partial<IJobList>) => {
    return JobsAPI.getAllJobs(params || { page: 1, pageSize: 10 });
  };

  const { data: allJobs } = useFetch<IJob>(['allJobs'], fetchAllJobs);

  const currentPage = allJobs?.pageInfo?.currentPage || 1;
  const pageSize = allJobs?.pageInfo?.itemsPerPage || 10;

  const columns = [
    {
      title: 'STT',
      width: 50,
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Tiêu đề công việc',
      width: 350,
      dataIndex: 'title',
    },
    {
      title: 'Tên công ty',
      width: 150,
      dataIndex: ['user', 'companyName'],
    },
    {
      title: 'Vị trí',
      width: 150,
      dataIndex: ['jobPosition', 'title'],
    },
    {
      title: 'Số lượng ứng tuyển',
      width: 150,
      dataIndex: 'quantity',
    },
    {
      title: 'Hình thức làm việc',
      width: 150,
      dataIndex: ['workType', 'title'],
    },
    {
      title: 'Khu vực',
      width: 350,
      render: (record: any) =>
        record?.jobsPlacements
          ?.map((item: any) => item?.placement?.title)
          .join(', '),
    },
    {
      title: 'Ngày đăng tin',
      width: 150,
      dataIndex: 'createAt',
      render: (value: string) => dayjs(value).format('DD/MM/YYYY HH:MM'),
    },
    {
      key: 'actions',
      width: 100,
      fixed: 'right',
      align: 'center',
      render: () => (
        <Space size={'middle'}>
          <Tooltip title="Xem chi tiết">
            <Button
              className="border-none hover:bg-transparent p-0"
              title={<Eye />}
            />
          </Tooltip>
          <Button
            className="border-none hover:bg-transparent p-0"
            title={<Switch />}
          />
        </Space>
      ),
    },
  ] as ColumnsType<any>;

  return (
    <Content>
      <Table
        loading={false}
        dataSource={allJobs?.items}
        columns={columns}
        scroll={{ x: 1800 }}
      />
    </Content>
  );
};

export default JobManagement;
