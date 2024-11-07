import { Table, Tag } from 'antd';
import Select, { DefaultOptionType } from 'antd/es/select';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import usePagination from '~/hooks/usePagination';
import { useAppSelector } from '~/hooks/useStore';
import { getAllJobs } from '~/store/thunk/job';
import { JobItem } from '~/types/Job';
import relativeTime from 'dayjs/plugin/relativeTime';
import icons from '~/utils/icons';
import { useNavigate } from 'react-router-dom';
import PATH from '~/utils/path';

const { EditOutlined } = icons;

dayjs.extend(relativeTime);
dayjs.locale('vi');

const optionStatus: DefaultOptionType[] = [
  {
    label: 'Trạng thái',
    value: 'all',
  },
  {
    label: 'Đang đánh giá',
    value: 'review',
  },
  {
    label: 'Phỏng vấn',
    value: 'interview',
  },
  {
    label: 'Đang offer',
    value: 'offer',
  },
  {
    label: 'Đang tuyển dụng',
    value: 'recruiting',
  },
  {
    label: 'Đã đóng',
    value: 'close',
  },
];

interface IParams {
  page: number;
  pageSize: number;
  id: number;
}
const RecruitmentList: React.FC = () => {
  const navigate = useNavigate();
  const { allJobs, loading } = useAppSelector((state) => state.jobs);
  const { currentUser } = useAppSelector((state) => state.auth);
  const [filters, setFilters] = useState<
    Partial<Omit<IParams, 'page' | 'pageSize'>>
  >({});

  const { currentPage, itemsPerPage, handlePageChange } = usePagination<
    JobItem,
    IParams
  >({
    fetchAction: getAllJobs,
    pageInfo: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: allJobs?.pageInfo?.totalItems || 0,
    },
    items: allJobs?.items,
    extraParams: filters,
  });

  useEffect(() => {
    const params: Partial<Omit<IParams, 'page' | 'pageSize'>> = {
      id: currentUser?.id,
    };

    setFilters(params);
  }, []);

  const columns = [
    {
      title: 'Vị trí tuyển dụng',
      dataIndex: 'title',
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: 'Người đăng',
      dataIndex: ['user', 'fullName'],
    },
    {
      title: 'Thời hạn ứng tuyển',
      dataIndex: 'applicationDeadline',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Địa điểm',
      dataIndex: ['jobsPlacements'],
      render: (record: any) => {
        return record.map((i: any) => i.placement.title).join(' - ');
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: () => <Tag color="cyan">Đang tuyển</Tag>,
    },
    {
      title: 'Hành động',
      render: (record: any) => (
        <EditOutlined
          onClick={() => navigate(PATH.UPDATE_JOB, { state: record })}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-800 mb-4">
            Quản lý tin tuyển dụng
          </h1>
        </div>
        <Select
          options={optionStatus}
          className="w-1/12"
          defaultValue={'Trạng thái'}
        ></Select>
      </div>

      <div className="p-6 bg-white">
        <Table
          loading={loading}
          columns={columns}
          dataSource={allJobs?.items || []}
          className="mb-4"
          pagination={
            allJobs && allJobs?.items?.length
              ? {
                  current: currentPage,
                  pageSize: itemsPerPage,
                  total: allJobs?.pageInfo?.totalItems,
                  onChange: handlePageChange,
                  showSizeChanger: false,
                }
              : false
          }
        />
      </div>
    </>
  );
};

export default RecruitmentList;
