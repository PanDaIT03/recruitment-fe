import { Badge, Card, Form, Table } from 'antd';
import React, { useState } from 'react';
import { JobsAPI } from '~/apis/job';
import { useFetch } from '~/hooks/useFetch';
import { Application } from '~/types/Job';
import icons from '~/utils/icons';

import { useForm } from 'antd/es/form/Form';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bag,
  Calendar,
  CalendarOutline,
  Edit,
  MenuIcon,
  User,
} from '~/assets/svg';
import CustomSelect from '~/components/Select/CustomSelect';
import PATH from '~/utils/path';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ModalStatusJob from '~/components/Modal/ModalStatusJob/index';
import useBreadcrumb from '~/hooks/useBreadcrumb';
dayjs.extend(relativeTime);
dayjs.locale('vi');

const { FilePdfOutlined, EditOutlined } = icons;

const Recruitment: React.FC = () => {
  const navigate = useNavigate();
  const [form] = useForm();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<
    Application['items'][0] | null
  >(null);

  const customBreadcrumbItems = [
    {
      path: PATH.EMPLOYER_RECRUITMENT,
      label: 'Tuyển dụng',
    },
  ];

  const breadcrumb = useBreadcrumb(customBreadcrumbItems, 'text-white');

  const { data: applicationJobs, refetch } = useFetch<Application>(
    ['JobsApplicants'],
    JobsAPI.getAllJobsApplicants
  );

  const toggleModal = () => setIsOpenModal(!isOpenModal);

  const handleEditClick = (record: Application['items'][0]) => {
    setSelectedRecord(record);
    toggleModal();
  };

  const columns = [
    {
      title: () => (
        <span className="flex items-center gap-2">
          <MenuIcon className="w-4 h-4 text-sub" />
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
          <User className="w-4 h-4 text-sub" />
          <span className="text-sm font-medium text-sub">Ứng viên</span>
        </span>
      ),
      dataIndex: ['user', 'fullName'],
    },
    {
      title: () => (
        <span className="flex items-center gap-2">
          <Bag className="w-4 h-4 text-sub" />
          <span className="text-sm font-medium text-sub">
            Vị trí tuyển dụng
          </span>
        </span>
      ),
      dataIndex: ['job'],
      render: (value: { id: number; title: string }) => (
        <Link to={`/job/${value.id}`}>{value.title}</Link>
      ),
    },
    {
      title: () => (
        <span className="flex items-center gap-2">
          <CalendarOutline className="w-4 h-4 text-sub" />
          <span className="text-sm font-medium text-sub">Ngày ứng tuyển</span>
        </span>
      ),
      dataIndex: 'createAt',
      render: (value: string) => (
        <>
          <p>{dayjs(value).format('DD/MM/YYYY')}</p>
          <p>{dayjs(value).fromNow()}</p>
        </>
      ),
    },
    {
      title: () => (
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sub" />
          <span className="text-sm font-medium text-sub">Ngày cập nhật</span>
        </span>
      ),
      render: (record: Application['items'][0]) =>
        dayjs(
          !record.employerUpdateAt ? record.createAt : record.employerUpdateAt
        ).format('DD/MM/YYYY'),
    },
    {
      title: () => (
        <span className="flex items-center gap-2">
          <Edit className="w-4 h-4 text-sub" />
        </span>
      ),
      render: () => (
        <FilePdfOutlined
          className="cursor-pointer"
          onClick={() =>
            navigate(PATH.EMPLOYER_RECRUITMENT_DETAIL, {
              state: applicationJobs?.items,
            })
          }
        />
      ),
    },
  ];

  return (
    <>
      <div className="bg-secondary border-t border-[#561d59]">
        <p className="px-16 w-full py-2">{breadcrumb}</p>
      </div>
      <div className="flex justify-between items-center bg-white px-16">
        <div>
          <p className="font-bold">Danh sách tuyển dụng</p>
          <p className="text-xs text-gray-500">Có 1 hồ sơ được tìm thấy</p>
        </div>
        <div className="pt-4">
          <Form form={form} layout="horizontal" className="flex gap-2">
            <Form.Item name="title">
              <CustomSelect
                prefixIcon={<MenuIcon className="w-4 h-4 text-sub" />}
                placeholder="Trạng thái"
              />
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="px-16 min-h-screen">
        <Card className="mt-6 text-center shadow-md">
          <Table
            columns={columns}
            dataSource={applicationJobs?.items}
            className="mb-4"
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

export default Recruitment;
