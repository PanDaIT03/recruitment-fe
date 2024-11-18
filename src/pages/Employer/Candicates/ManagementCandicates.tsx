import { Form, Table, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { JobsAPI } from '~/apis/job';
import { Calendar, Database, Filter, Hash, Search, User } from '~/assets/svg';
import CustomSelect from '~/components/Select/CustomSelect';
import useBreadcrumb from '~/hooks/useBreadcrumb';
import { useFetch } from '~/hooks/useFetch';
import { Application } from '~/types/Job';
import PATH from '~/utils/path';

const { Text, Paragraph } = Typography;

const ManagementCandicates = () => {
  const [form] = useForm();

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

  const { data: applicationJobs } = useFetch<Application>(
    ['JobsApplicants'],
    JobsAPI.getAllJobsApplicants
  );

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
      dataIndex: '',
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
          <span className="text-sm font-medium text-sub">Hashtags</span>
        </span>
      ),
      dataIndex: '',
    },
    {
      title: () => (
        <span className="flex items-center gap-2">
          <Calendar className="text-sub w-4 h-4" />
          <span className="text-sm font-medium text-sub">Cập nhật</span>
        </span>
      ),
      dataIndex: 'createAt',
      render: (value: string) => dayjs(value).format('DD/MM/YYYY'),
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
          <Form form={form} layout="horizontal" className="flex gap-2">
            <Form.Item name="title">
              <CustomSelect
                prefixIcon={<Search />}
                options={[]}
                placeholder="Chọn tên tin tuyển dụng"
              />
            </Form.Item>
            <Form.Item name="status">
              <CustomSelect
                prefixIcon={<Hash />}
                options={[]}
                placeholder="Chọn trạng thái"
              />
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="p-4 px-16">
        <Table
          columns={columns}
          dataSource={applicationJobs?.items}
          pagination={false}
        />
      </div>
    </>
  );
};

export default ManagementCandicates;
