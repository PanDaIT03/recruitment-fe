import { Col, Form, Row, Space, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Eye, FilterAdmin } from '~/assets/svg';
import Button from '~/components/Button/Button';
import Content from '~/components/Content/Content';
import Table from '~/components/Table/Table';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import usePagination from '~/hooks/usePagination';
import useQueryParams from '~/hooks/useQueryParams';
import { useAppSelector } from '~/hooks/useStore';
import { getAllJobs } from '~/store/thunk/job';
import JobFilterBox from './JobFilterBox';

const JobManagement: React.FC = () => {
  const { allJobs, loading } = useAppSelector((state) => state.jobs),
    queryParams = useQueryParams(),
    [form] = Form.useForm();

  const { setTitle } = useTitle(),
    { setBreadcrumb } = useBreadcrumb();

  const paginationParams = {
    page: Number(queryParams.get('page') || 1),
    pageSize: Number(queryParams.get('pageSize') || 10),
  };

  const [filterParams, setFilterParams] = useState({} as any),
    [isOpenFilter, setIsOpenFilter] = useState(false);

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
        title: 'Người đăng tin',
        width: 150,
        dataIndex: ['user', 'fullName'],
      },
      {
        title: 'Ngày cập nhật',
        width: 150,
        dataIndex: 'updateAt',
        render: (value: string) => dayjs(value).format('DD/MM/YYYY HH:MM'),
      },
      {
        title: 'Người cập nhật',
        width: 150,
        dataIndex: ['user', 'fullName'],
      },
      {
        title: 'Thao tác',
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
          </Space>
        ),
      },
    ] as ColumnsType<any>;
  }, []);

  useEffect(() => {
    setTitle('Danh sách công việc');
    setBreadcrumb([
      { title: 'Quản lý công việc' },
      { title: 'Danh sách công việc' },
    ]);
  }, []);

  const handleOnFilterButtonClick = useCallback(() => {
    setIsOpenFilter((prev) => !prev);
  }, []);

  const handleFinish = useCallback((values: any) => {
    console.log(values);

    setFilterParams({
      ...values,
      ...(values.placementIds && {
        placementIds: values.placementIds.join(','),
      }),
    });
  }, []);

  const handleCancel = useCallback(() => {
    setFilterParams({});
  }, []);

  return (
    <>
      <Row align={'middle'} justify={'end'}>
        <Col>
          <Button
            title={<FilterAdmin />}
            className={classNames(
              'text-admin-primary border-primary-110 hover:bg-primary-110 hover:text-white',
              isOpenFilter && 'text-white bg-admin-primary'
            )}
            onClick={handleOnFilterButtonClick}
          />
        </Col>
      </Row>
      <JobFilterBox
        form={form}
        open={isOpenFilter}
        job={{ items: allJobs?.items, loading: loading }}
        onFinish={handleFinish}
        onCancel={handleCancel}
      />
      <Content className="!bg-[#2f2f41b3]">
        <Table
          loading={loading}
          dataSource={jobItems}
          columns={columns}
          scroll={{ x: 2000 }}
          pagination={{
            current: pageInfo?.currentPage,
            pageSize: pageInfo?.itemsPerPage,
            total: pageInfo?.totalItems,
            onChange: handlePageChange,
          }}
        />
      </Content>
    </>
  );
};

export default JobManagement;
