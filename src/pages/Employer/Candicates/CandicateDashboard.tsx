import { ArrowUpOutlined } from '@ant-design/icons';
import { Badge, Card, Col, Row, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import relativeTime from 'dayjs/plugin/relativeTime';
import { Calendar, Filter, Hash, User } from '~/assets/svg';
import PATH from '~/utils/path';
import useBreadcrumb from '~/hooks/useBreadcrumb';
import { useFetch } from '~/hooks/useFetch';
import { Application } from '~/types/Job';
import { JobsAPI } from '~/apis/job';
import icons from '~/utils/icons';
import ModalStatusJob from '~/components/Modal/ModalStatusJob';
import { useNavigate } from 'react-router-dom';
dayjs.extend(relativeTime);
dayjs.locale('vi');

const { EditOutlined } = icons;

const { Title, Text, Paragraph } = Typography;

const CandicateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<
    Application['items'][0] | null
  >(null);
  const customBreadcrumbItems = [
    {
      path: PATH.EMPLOYER_CANDICATES_DASHBOARD,
      label: 'Ứng viên',
    },
    {
      path: PATH.EMPLOYER_CANDICATES_DASHBOARD,
      label: 'Tổng quan',
    },
  ];

  const breadcrumb = useBreadcrumb(customBreadcrumbItems, 'text-white');

  const { data: applicationJobs, refetch } = useFetch<Application>(
    ['JobsApplicants', 'new', currentPage.toString(), pageSize.toString()],
    () =>
      JobsAPI.getAllJobsApplicants(undefined, 'new', {
        page: currentPage,
        pageSize: pageSize,
      })
  );

  const stats = [
    { title: 'Số lượng ứng viên mới', value: 0 },
    { title: 'Ứng viên tự ứng tuyển', value: 0 },
    { title: 'Ứng viên được chia sẻ', value: 0 },
    { title: 'Ứng viên từ nguồn khác', value: 0 },
  ];

  const toggleModal = () => setIsOpenModal(!isOpenModal);

  const handleEditClick = (record: Application['items'][0]) => {
    setSelectedRecord(record);
    toggleModal();
  };

  const columns = [
    {
      title: () => (
        <span className="flex items-center gap-2">
          <User className="text-sub w-4 h-4" />
          <span className="text-sm font-medium text-sub">Ứng viên</span>
        </span>
      ),
      dataIndex: ['user', 'fullName'],
    },
    {
      title: () => (
        <span className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-sub" />
          <span className="text-sm font-medium text-sub">
            Vị trí tuyển dụng
          </span>
        </span>
      ),
      dataIndex: ['job', 'title'],
      render: (value: string) => (
        <span
          className="cursor-pointer hover:underline"
          onClick={() =>
            navigate(PATH.EMPLOYER_RECRUITMENT_DETAIL, {
              state: applicationJobs?.items,
            })
          }
        >
          {value}
        </span>
      ),
    },
    {
      title: () => (
        <span className="flex items-center gap-2">
          <Hash className="text-sub w-4 h-4" />
          <span className="text-sm font-medium text-sub">Trạng thái</span>
        </span>
      ),
      dataIndex: ['status', 'title'],
      render: (value: string, record: Application['items'][0]) => {
        const isBlue =
          record.status.id === 1 ||
          record.status.id === 2 ||
          record.status.id === 4;
        const isGreen = record.status.id === 3;

        return (
          <p className="flex items-center gap-2">
            <Badge
              color={`${isBlue ? '#1677ff' : isGreen ? '#22c55e' : '#78726de6'} `}
            />
            <span
              className={`${isBlue ? 'text-blue' : isGreen ? 'text-green-500' : 'text-sub'}`}
            >
              {value}
            </span>
            <EditOutlined
              className="cursor-pointer !text-sub"
              onClick={() => handleEditClick(record)}
            />
          </p>
        );
      },
    },
    {
      title: () => (
        <span className="flex items-center gap-2">
          <Calendar className="text-sub w-4 h-4" />
          <span className="text-sm font-medium text-sub">Cập nhật</span>
        </span>
      ),
      dataIndex: 'employerUpdateAt',
      render: (value: string, record: Application['items'][0]) =>
        !value
          ? dayjs(record.createAt).format('DD/MM/YYYY HH:MM')
          : dayjs(value).format('DD/MM/YYYY HH:MM'),
    },
  ];

  return (
    <>
      <div className="bg-secondary border-t border-[#561d59]">
        <p className="px-16 w-full py-2">{breadcrumb}</p>
      </div>
      <div className="px-16  min-h-screen">
        <Row gutter={[16, 16]} className="mt-4">
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

          <Table
            columns={columns}
            dataSource={applicationJobs?.items}
            pagination={{
              current: applicationJobs?.pageInfo?.currentPage || 1,
              pageSize: applicationJobs?.pageInfo?.itemsPerPage || 10,
              total: applicationJobs?.pageInfo?.totalItems,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              },
              showSizeChanger: true,
            }}
          />
        </Card>
      </div>

      <ModalStatusJob
        isOpen={isOpenModal}
        handleCancel={toggleModal}
        data={selectedRecord}
        refetch={refetch}
      />
    </>
  );
};

export default CandicateDashboard;
