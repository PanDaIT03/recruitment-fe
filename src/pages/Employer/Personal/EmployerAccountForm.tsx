import type { GetProp } from 'antd';
import {
  Avatar,
  Form,
  Input,
  message,
  Select,
  Upload,
  UploadProps,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { JobsAPI } from '~/apis/job';
import UserApi from '~/apis/user';
import Button from '~/components/Button/Button';
import { useFetch } from '~/hooks/useFetch';
import { useAppSelector } from '~/hooks/useStore';
import { PaginatedJobPositions } from '~/types/Job';

const { Option } = Select;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export interface IUpdateInfoEmployer {
  fullName: string;
  phoneNumber: number;
  companyName: string;
  companyUrl: string;
  jobPositionsId: number;
  file: File;
}

const EmployerAccountForm: React.FC = () => {
  const [form] = Form.useForm();
  const { currentUser } = useAppSelector((state) => state.auth);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: jobPositions } = useFetch<PaginatedJobPositions>(
    ['allJobsPositions'],
    JobsAPI.getAllJobPositions
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
      return;
    }
    if (info.file.status === 'done') {
      const url =
        info.file.response?.url ||
        (info.file.originFileObj
          ? URL.createObjectURL(info.file.originFileObj)
          : null);
      setImageUrl(url);
    }
  };

  const onFinish = async (values: IUpdateInfoEmployer) => {
    const formData = new FormData();

    formData.append('fullName', values.fullName);
    formData.append('phoneNumber', String(values.phoneNumber));
    formData.append('companyName', values.companyName);
    formData.append('companyUrl', values.companyUrl || '');
    formData.append('jobPositionsId', String(values.jobPositionsId));

    const fileList = form.getFieldValue('avatar');
    if (fileList && fileList[0]?.originFileObj) {
      formData.append('file', fileList[0].originFileObj);
    }

    try {
      setLoading(true);
      const response = await UserApi.updateInfoEmployer(formData);
      if (response.statusCode === 200) {
        message.success(response.message);
        setLoading(false);
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật thông tin!');
      console.error(error);
    }
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
            showUploadList={false}
            onChange={handleChange}
            beforeUpload={(file) => {
              const isValid = beforeUpload(file);
              if (isValid === true) {
                setImageUrl(URL.createObjectURL(file));
                form.setFieldsValue({ avatar: [{ originFileObj: file }] });
              }
              return false;
            }}
          >
            <Avatar src={imageUrl} alt="avatar" className="w-full h-full" />
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

        <Form.Item name="jobPositionsId" label="Cấp bậc">
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
            loading={loading}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default EmployerAccountForm;
