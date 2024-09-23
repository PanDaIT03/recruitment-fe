import { Editor } from '@tinymce/tinymce-react';
import { Divider, Form, Input, InputNumber, Radio, Select } from 'antd';
import axios from 'axios';
import React, { useRef } from 'react';
import { JobsAPI } from '~/apis/job';
import Button from '~/components/Button/Button';
import useBreadcrumb from '~/hooks/useBreadcrumb';
import { useFetch } from '~/hooks/useFetch';
import {
  JobCategory,
  JobField,
  JobPlacement,
  JobPosition,
  WorkType,
} from '~/types/Job';
import PATH from '~/utils/path';

const { Option } = Select;

const PostingJob: React.FC = () => {
  const [form] = Form.useForm();

  const customBreadcrumbItems = [
    {
      path: PATH.EMPLOYER_DASHBOARD,
      label: 'Nhà tuyển dụng',
    },
    {
      path: PATH.EMPLOYER_POSTING,
      label: 'Đăng tin',
    },
  ];

  const breadcrumb = useBreadcrumb(customBreadcrumbItems);

  const { data: jobPositions } = useFetch<JobPosition[]>(
    JobsAPI.getAllJobPositions
  );
  const { data: jobCategories } = useFetch<JobCategory[]>(
    JobsAPI.getAllJobCategories
  );
  const { data: workType } = useFetch<WorkType[]>(JobsAPI.getAllWorkTypes);

  const { data: jobPlacements } = useFetch<JobPlacement[]>(
    JobsAPI.getAllPlacements
  );

  const { data: jobFields } = useFetch<JobField[]>(JobsAPI.getAllJobFields);

  const cleanFormValues = (values: any) => {
    const cleanValues = { ...values };
    ['description', 'requirements', 'benefits'].forEach((field) => {
      if (cleanValues[field]) {
        cleanValues[field] = cleanValues[field].toString();
      } else {
        cleanValues[field] = '';
      }
    });
    return cleanValues;
  };

  const onFinish = async () => {
    try {
      const values = form.getFieldsValue();

      const payload = {
        ...values,
        description: values.description?.level?.content || '',
        requirements: values.requirements?.level?.content || '',
        benefits: values.benefits?.level?.content || '',
      };

      const cleanValues = cleanFormValues(payload);

      const response = await JobsAPI.postJob(cleanValues);

      console.log(response);
    } catch (error: unknown) {
      console.error(error);
    }
  };
  return (
    <>
      {breadcrumb}
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="max-w-3xl mx-auto p-4 rounded-md border-non  shadow"
      >
        <h2 className="text-xl font-bold mb-4">Thông tin cơ bản</h2>
        <Divider />
        <Form.Item
          name="title"
          label="Vị trí tuyển dụng"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="company"
          label="Lĩnh vực của vị trí tuyển dụng này là gì?"
          rules={[{ required: true }]}
        >
          <Select placeholder="Chọn danh mục">
            {jobFields?.map((field) => (
              <Option value={field.id} key={field.id}>
                {field.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="jobType"
          label="Loại công việc"
          rules={[{ required: true }]}
        >
          <Radio.Group className="flex flex-col gap-4">
            {jobCategories?.map((category) => (
              <Radio value={category.id} key={category?.id.toString()}>
                {category.name}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="workType"
          label="Hình thức làm việc"
          rules={[{ required: true }]}
        >
          <Radio.Group className="flex flex-col gap-4">
            {workType?.map((type) => (
              <Radio value={type?.id} key={type?.id.toString()}>
                {type?.title}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item name="level" label="Cấp bậc" rules={[{ required: true }]}>
          <Select placeholder="Chọn cấp bậc">
            {jobPositions?.map((position) => (
              <Option key={position.id} value={position.id}>
                {position.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="placements"
          label="Địa điểm làm việc (tối đa 3 địa điểm)"
          rules={[{ required: true }]}
        >
          <Select placeholder="Chọn danh mục" mode="multiple" maxCount={3}>
            {jobPlacements?.map((place) => (
              <Option value={place?.id} key={place.id}>
                {place?.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Mức lương (không bắt buộc)" className="mb-4">
          <Input.Group compact>
            <Input.Group compact className="w-full">
              <Form.Item name={'salaryMin'} noStyle>
                <InputNumber
                  className="w-full"
                  placeholder="Từ mức lương"
                  min={0}
                />
              </Form.Item>
              <Form.Item name={'salaryMax'} noStyle>
                <InputNumber
                  className="w-full"
                  placeholder="Đến mức lương"
                  min={0}
                />
              </Form.Item>
            </Input.Group>
          </Input.Group>
          <p className="mt-2">
            <span className="text-gray-400">Ứng viên sẽ nhìn thấy:</span>
            <span className="italic text-red-500"> Thương lượng</span>
          </p>
        </Form.Item>

        <Form.Item name="description" label="Mô tả công việc">
          <Editor
            apiKey={import.meta.env.VITE_APP_TINYMCE_API_KEY}
            init={{
              height: 200,
              menubar: false,
              plugins: [
                'advlist',
                'autolink',
                'lists',
                'link',
                'image',
                'charmap',
                'preview',
                'anchor',
                'searchreplace',
                'visualblocks',
                'code',
                'fullscreen',
                'insertdatetime',
                'media',
                'table',
                'code',
                'help',
                'wordcount',
              ],
              toolbar:
                'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style:
                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
          />
        </Form.Item>

        <Form.Item name="requirements" label="Yêu cầu ứng viên">
          <Editor
            apiKey={import.meta.env.VITE_APP_TINYMCE_API_KEY}
            init={{
              height: 200,
              menubar: false,
              plugins: [
                'lists',
                'link',
                'image',
                'charmap',
                'preview',
                'anchor',
                'searchreplace',
                'visualblocks',
                'code',
                'fullscreen',
                'insertdatetime',
                'media',
                'table',
                'code',
                'help',
                'wordcount',
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
            }}
          />
        </Form.Item>

        <Form.Item name="benefits" label="Quyền lợi">
          <Editor
            apiKey={import.meta.env.VITE_APP_TINYMCE_API_KEY}
            init={{
              height: 200,
              menubar: false,
              plugins: [
                'lists',
                'link',
                'image',
                'charmap',
                'preview',
                'anchor',
                'searchreplace',
                'visualblocks',
                'code',
                'fullscreen',
                'insertdatetime',
                'media',
                'table',
                'code',
                'help',
                'wordcount',
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button title="Đăng tin" className="w-full" fill type="submit" />
        </Form.Item>
      </Form>
    </>
  );
};

export default PostingJob;
