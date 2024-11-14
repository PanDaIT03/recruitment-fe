import { Form, Table, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Calendar, Database, Filter, Hash, Search, User } from '~/assets/svg';
import CustomSelect from '~/components/Select/CustomSelect';

const { Text, Paragraph } = Typography;

const ManagementCandicates = () => {
  const [form] = useForm();

  const columns = [
    {
      title: () => (
        <span className="flex items-center gap-2">
          <User className="text-sub w-4 h-4" />
          <span className="text-sm font-medium text-sub">Ứng viên</span>
        </span>
      ),
      dataIndex: '',
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
      dataIndex: '',
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
      dataIndex: '',
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <Paragraph className="flex flex-col">
          <Text strong>Ứng viên</Text>
          <Text>Có 6 ứng viên được tìm thấy</Text>
        </Paragraph>
        <div>
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

      <Table columns={columns} dataSource={[]} />
    </div>
  );
};

export default ManagementCandicates;
