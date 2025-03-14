import { Col, Form, Row, Space, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { IPaginationParams } from '~/apis/job';
import { Eye, FilterAdmin } from '~/assets/svg';
import Button from '~/components/Button/Button';
import Content from '~/components/Content/Content';
import Table from '~/components/Table/Table';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import usePagination from '~/hooks/usePagination';
import { useAppSelector } from '~/hooks/useStore';
import { IJobList } from '~/pages/Job/JobList/JobList';
import { getAllJobs } from '~/store/thunk/job';
import JobFilterBox from './JobFilterBox';

interface IFilterForm {
  workTypesId: number;
  statusId: number;
  jobsId: number;
  placementIds: number[];
}

const initialFilterParams = {
  type: 'more',
} as any;

const JobManagement = () => {
  const [formFilter] = Form.useForm<IFilterForm>();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const { allJobs, loading } = useAppSelector((state) => state.jobs);

  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [filterParams, setFilterParams] = useState(initialFilterParams);

  const defaultFilter: IPaginationParams & Partial<IJobList> = useMemo(() => {
    return { type: 'more' };
  }, []);

  const {
    pageInfo,
    items: jobItems,
    handlePageChange,
    hanldeClearURLSearchParams,
  } = usePagination({
    items: allJobs?.items,
    fetchAction: getAllJobs,
    extraParams: filterParams,
    setFilterParams: setFilterParams,
  });

  const columns = useMemo(() => {
    return [
      {
        title: 'STT',
        width: 50,
        render: (_: any, __: any, index: number) =>
          (pageInfo.page - 1) * pageInfo.pageSize + index + 1,
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
  }, [pageInfo]);

  useEffect(() => {
    setTitle('Danh sách công việc');
    setBreadcrumb([{ title: 'Quản lý' }, { title: 'Danh sách công việc' }]);
  }, []);

  const handleOnFilterButtonClick = useCallback(() => {
    setIsOpenFilter((prev) => !prev);
  }, []);

  const handleFinish = useCallback(
    (values: any) => {
      setFilterParams({
        ...defaultFilter,
        ...values,
        ...(values.placementIds && {
          placementIds: values.placementIds.join(','),
        }),
      });
    },
    [defaultFilter]
  );

  const handleCancel = useCallback(() => {
    setIsOpenFilter(false);
    setFilterParams({ ...defaultFilter });
    hanldeClearURLSearchParams(defaultFilter);
  }, [defaultFilter]);

  return (
    <>
      <Row align={'middle'} justify={'end'}>
        <Col>
          <Button
            title={<FilterAdmin />}
            className={'bg-white'}
            onClick={handleOnFilterButtonClick}
          />
        </Col>
      </Row>
      <JobFilterBox
        form={formFilter}
        open={isOpenFilter}
        onFinish={handleFinish}
        onCancel={handleCancel}
        setFilterParams={setFilterParams}
      />
      <Content>
        <Table
          loading={loading}
          columns={columns}
          dataSource={jobItems}
          scroll={{ x: 2000 }}
          pagination={{
            current: pageInfo.page,
            pageSize: pageInfo.pageSize,
            total: allJobs?.pageInfo?.totalPages,
            onChange: handlePageChange,
          }}
        />
      </Content>
    </>
  );
};

export default JobManagement;
