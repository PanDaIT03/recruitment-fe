import { Badge, Form, Table, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { JobsAPI } from '~/apis/job';
import { Calendar, Database, Filter, Hash, Search, User } from '~/assets/svg';
import ModalStatusJob from '~/components/Modal/ModalStatusJob';
import CustomSelect from '~/components/Select/CustomSelect';
import useBreadcrumb from '~/hooks/useBreadcrumb';
import { useFetch } from '~/hooks/useFetch';
import { Application, StatusJob } from '~/types/Job';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
const { EditOutlined } = icons;

const { Text, Paragraph } = Typography;

const ManagementCandicates = () => {
  const [form] = useForm();
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
      path: PATH.EMPLOYER_CANDICATES_MANAGEMENT,
      label: 'Quản lý',
    },
  ];

  const breadcrumb = useBreadcrumb(customBreadcrumbItems, 'text-white');

  const params = { type: 'Phỏng vấn' };

  const { data: allStatusJob } = useFetch<StatusJob>(
    ['getAllStatusJob', params.type],
    () => JobsAPI.getAllStatusJob(params.type)
  );

  const statusJob = useMemo(() => {
    return allStatusJob?.items.map((apply) => ({
      value: apply.id,
      label: apply.title,
    }));
  }, [allStatusJob]);

  const statusId = Form.useWatch('statusId', form);

  const {
    data: applicationJobs,
    refetch,
    isLoading,
  } = useFetch<Application>(
    ['JobsApplicants', statusId || 'all', currentPage, pageSize],
    () =>
      JobsAPI.getAllJobsApplicants(statusId, undefined, {
        page: currentPage,
        pageSize: pageSize,
      })
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
          <User className="text-sub w-4 h-4" />
          <span className="text-sm font-medium text-sub">Ứng viên</span>
        </span>
      ),
      dataIndex: ['user', 'fullName'],
    },
    {
      title: () => (
        <span className="flex items-center gap-2">
          <Database className="text-sub w-4 h-4" />
          <span className="text-sm font-medium text-sub">Nguồn</span>
        </span>
      ),
      dataIndex: 'referrerId',
      render: (value: number) => (!value ? 'Ứng tuyển' : 'Thêm bởi thành viên'),
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
      <div className="flex justify-between pt-4 bg-white">
        <Paragraph className="flex flex-col px-16">
          <Text strong>Ứng viên</Text>
          <Text>Có 6 ứng viên được tìm thấy</Text>
        </Paragraph>
        <div className="px-16">
          <Form
            form={form}
            layout="horizontal"
            className="flex gap-2"
            onValuesChange={() => {
              setCurrentPage(1);
              refetch();
            }}
          >
            <Form.Item name="title">
              <CustomSelect
                prefixIcon={<Search />}
                options={[]}
                placeholder="Chọn tên tin tuyển dụng"
              />
            </Form.Item>
            <Form.Item name="statusId">
              <CustomSelect
                allowClear
                prefixIcon={<Hash />}
                options={statusJob || []}
                placeholder="Chọn trạng thái"
              />
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="p-4 px-16">
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={applicationJobs?.items}
          pagination={{
            current: applicationJobs?.pageInfo?.currentPage || 1,
            pageSize: applicationJobs?.pageInfo?.itemsPerPage || 10,
            total: applicationJobs?.pageInfo?.totalItems,
            onChange: (page, pageSize) => {
              window.scrollTo(0, 0);
              setCurrentPage(page);
              setPageSize(pageSize);
            },
            showSizeChanger: true,
          }}
        />
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

export default ManagementCandicates;
