import { Space, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Eye } from '~/assets/svg';
import Button from '~/components/Button/Button';
import Content from '~/components/Content/Content';
import Switch from '~/components/Switch/Switch';
import Table from '~/components/Table/Table';
import usePagination from '~/hooks/usePagination';
import useQueryParams from '~/hooks/useQueryParams';
import { useAppSelector } from '~/hooks/useStore';
import { getAllJobs } from '~/store/thunk/job';

const JobManagement: React.FC = () => {
  const { allJobs, loading } = useAppSelector((state) => state.jobs),
    queryParams = useQueryParams();

  const paginationParams = {
    page: Number(queryParams.get('page')),
    pageSize: Number(queryParams.get('pageSize')),
  };

  const [filterParams, setFilterParams] = useState({} as any);

  const {
    currentPage,
    itemsPerPage,
    items: jobItems,
    pageInfo,
    handlePageChange,
  } = usePagination({
    fetchAction: getAllJobs,
    extraParams: filterParams,
    items: allJobs?.items,
    pageInfo: {
      currentPage: paginationParams?.page,
      itemsPerPage: paginationParams?.pageSize,
      totalItems: allJobs?.pageInfo?.totalItems ?? 0,
    },
  });

  const columns = useMemo(() => {
    return [
      {
        title: 'STT',
        width: 50,
        render: (_: any, __: any, index: number) =>
          (currentPage - 1) * itemsPerPage + index + 1,
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
  }, []);

  return (
    <Content>
      <Table
        loading={loading}
        dataSource={jobItems}
        columns={columns}
        scroll={{ x: 1800 }}
        pagination={{
          current: pageInfo?.currentPage,
          pageSize: pageInfo?.itemsPerPage,
          total: pageInfo?.totalItems,
          onChange: handlePageChange,
        }}
      />
    </Content>
  );
};

export default JobManagement;
