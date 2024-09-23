import { Editor } from '@tinymce/tinymce-react';
import { Divider, Form, Input, InputNumber, Radio, Select } from 'antd';
import React from 'react';
import { JobsAPI } from '~/apis/job';
import Button from '~/components/Button/Button';
import useBreadcrumb from '~/hooks/useBreadcrumb';
import { useFetch } from '~/hooks/useFetch';
import {
  JobPlacement,
  PaginatedJobCategories,
  PaginatedJobFields,
  PaginatedJobPositions,
  PaginatedWorkTypes,
} from '~/types/Job';
import PATH from '~/utils/path';

const { Option } = Select;

export interface PostingJobFormValues {
  title: string;
  jobField: number;
  jobCategory: number;
  workType: number;
  jobPosition: number;
  placements: number[];
  startPrice?: number;
  endPrice?: number;
  description: string;
  requirement: string;
  whyLove: string;
  applicationDeadline?: string;
  workTime?: string;
  startExpYearRequired?: number;
  endExpYearRequired?: number;
  [key: string]: any;
}

const PostingJob: React.FC = () => {
  const [form] = Form.useForm<PostingJobFormValues>();

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

  const { data: jobPositions } = useFetch<PaginatedJobPositions>(
    JobsAPI.getAllJobPositions
  );
  const { data: jobCategories } = useFetch<PaginatedJobCategories>(
    JobsAPI.getAllJobCategories
  );
  const { data: workType } = useFetch<PaginatedWorkTypes>(
    JobsAPI.getAllWorkTypes
  );
  const { data: jobPlacements } = useFetch<JobPlacement[]>(
    JobsAPI.getAllPlacements
  );
  const { data: jobFields } = useFetch<PaginatedJobFields>(
    JobsAPI.getAllJobFields
  );

  const cleanFormValues = (
    values: PostingJobFormValues
  ): PostingJobFormValues => {
    return Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v != null)
    ) as PostingJobFormValues;
  };

  const onFinish = async () => {
    try {
      const values = form.getFieldsValue();
      const cleanValues = cleanFormValues(values);
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
        className="max-w-3xl mx-auto p-4 rounded-md border-none shadow"
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
            {jobFields?.items?.map?.((field) => (
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
            {jobCategories?.items.map?.((category) => (
              <Radio value={category.id} key={category.id}>
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
            {workType?.items.map?.((type) => (
              <Radio value={type.id} key={type.id}>
                {type.title}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item name="level" label="Cấp bậc" rules={[{ required: true }]}>
          <Select placeholder="Chọn cấp bậc">
            {jobPositions?.items.map?.((position) => (
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
          <Select placeholder="Chọn địa điểm" mode="multiple" maxCount={3}>
            {jobPlacements?.map((place) => (
              <Option value={place.id} key={place.id}>
                {place.title}
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
