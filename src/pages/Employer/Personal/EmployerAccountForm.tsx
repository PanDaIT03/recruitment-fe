import React, { useEffect, useState } from 'react';
import { Form, Input, message, Upload, UploadProps, Image, Select } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAppSelector } from '~/hooks/useStore';
import Button from '~/components/Button/Button';
import type { GetProp } from 'antd';
import { useFetch } from '~/hooks/useFetch';
import { PaginatedJobPositions } from '~/types/Job';
import { JobsAPI } from '~/apis/job';

const { Option } = Select;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const EmployerAccountForm: React.FC = () => {
  const [form] = Form.useForm();
  const { currentUser } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { data: jobPositions } = useFetch<PaginatedJobPositions, {}>(
    JobsAPI.getAllJobPositions,
    {}
  );

  useEffect(() => {
    form.setFieldsValue({
      ...currentUser,
      positionsId: currentUser?.jobPosition.id,
    });
    if (currentUser?.avatarUrl) {
      setImageUrl(currentUser.avatarUrl);
    }
  }, [form, currentUser]);

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Tệp tin không hợp lệ! Chỉ hỗ trợ JPG/PNG!');
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Hình ảnh phải nhỏ hơn 2MB!');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      const url =
        info.file.response?.url ||
        (info.file.originFileObj
          ? URL.createObjectURL(info.file.originFileObj)
          : null);
      setImageUrl(url);
      setLoading(false);
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onFinish = (values: any) => {
    console.log('Received values: ', values);
    message.success('Cập nhật thông tin thành công!');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-10">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Cập nhật thông tin tài khoản
        </h2>
        <div className="flex items-center justify-center">
          <Upload
            name="avatar"
            capture="user"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            action="https://your-api-endpoint.com/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <Image src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        name="update-profile"
        onFinish={onFinish}
        className="space-y-4"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!', type: 'email' },
          ]}
        >
          <Input placeholder="Nhập email" className="rounded-md" disabled />
        </Form.Item>

        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
        >
          <Input placeholder="Nhập họ và tên" className="rounded-md" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
        >
          <Input placeholder="Nhập số điện thoại" className="rounded-md" />
        </Form.Item>

        <Form.Item
          label="Tên công ty"
          name="companyName"
          rules={[{ required: true, message: 'Vui lòng nhập tên công ty!' }]}
        >
          <Input placeholder="Nhập tên công ty" className="rounded-md" />
        </Form.Item>

        <Form.Item label="Website công ty" name="companyUrl">
          <Input placeholder="Nhập website công ty" className="rounded-md" />
        </Form.Item>

        <Form.Item name="positionsId" label="Cấp bậc">
          <Select placeholder="Chức vụ">
            {jobPositions?.items.map?.((position) => (
              <Option key={position.id} value={position.id}>
                {position.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            title="Cập nhật thông tin"
            type="submit"
            fill
            className="w-full"
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default EmployerAccountForm;
