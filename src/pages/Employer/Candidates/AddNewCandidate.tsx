import { Form, Upload } from 'antd';
import { Card, Email, PersonCard, Phone } from '~/assets/svg';
import Button from '~/components/Button/Button';
import Input from '~/components/Input/Input';
import useBreadcrumb from '~/hooks/useBreadcrumb';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { CloudUploadOutlined } = icons;

const AddNewCandidate = () => {
  const [form] = Form.useForm();

  const customBreadcrumbItems = [
    {
      path: PATH.EMPLOYER_CANDIDATES_DASHBOARD,
      label: 'Ứng viên',
    },
    {
      path: PATH.EMPLOYER_CANDIDATES_ADD_NEW,
      label: 'Thêm ứng viên',
    },
  ];

  const breadcrumb = useBreadcrumb(customBreadcrumbItems, 'text-white');

  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  return (
    <>
      <div className="bg-secondary border-t border-[#561d59]">
        <p className="px-16 w-full py-2">{breadcrumb}</p>
      </div>
      <div className="flex items-center justify-center">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="my-4 rounded-md lg:w-[50%] bg-white p-4"
        >
          <Form.Item
            label={<span className="font-medium">Họ và tên</span>}
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
          >
            <Input
              prefix={<PersonCard className="text-sub w-4 h-4" />}
              placeholder="Ví dụ: Nguyễn Văn"
              className="w-full p-2 border rounded"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium">Chức vụ hiện tại</span>}
            name="currentPosition"
          >
            <Input
              prefix={<Card className="text-sub w-4 h-4" />}
              placeholder="Ví dụ: Chuyên viên tuyển dụng"
              className="w-full p-2 border rounded"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium">Email</span>}
            name="email"
            rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
          >
            <Input
              prefix={<Email className="text-sub w-4 h-4" />}
              placeholder="Ví dụ: tony.stark@example.com"
              className="w-full p-2 border rounded"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium">Số điện thoại</span>}
            name="phone"
            extra={
              <span className="text-gray-400 text-sm">Chỉ bao gồm chữ số</span>
            }
          >
            <Input
              prefix={<Phone className="text-sub w-4 h-4" />}
              placeholder="Ví dụ: 0912345678"
              className="w-full p-2 border rounded"
            />
          </Form.Item>

          <div>
            <p className="mb-4 font-medium">
              CV ứng viên <span className="text-red-500">*</span>
            </p>
            <Upload.Dragger
              name="file"
              multiple={false}
              accept=".pdf,.doc,.docx"
            >
              <p className="text-center text-gray-600">
                <CloudUploadOutlined className="text-2xl mb-2" />
                <br />
                Nhấn vào hoặc kéo thả tập tin để tải lên
              </p>
              <p className="text-center text-gray-400 text-sm mt-2">
                Hỗ trợ tập tin: PDF, DOC, DOCX
              </p>
            </Upload.Dragger>
          </div>

          <div className="flex mt-6 gap-4">
            <Button title="Để sau" className="w-1/4" />

            <Button
              type="submit"
              title="Thêm ứng viên"
              className="w-3/4"
              fill
            />
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddNewCandidate;
