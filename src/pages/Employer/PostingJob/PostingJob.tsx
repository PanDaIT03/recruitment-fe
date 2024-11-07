import { Editor } from '@tinymce/tinymce-react';
import {
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
} from 'antd';
import dayjs from 'dayjs';
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
import toast from '~/utils/functions/toast';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { Option } = Select;
const { TeamOutlined } = icons;

export interface PostingJobFormValues {
  title: string;
  jobField: number;
  jobCategory: number;
  workType: number;
  jobPosition: number;
  placements: number[];
  startPrice?: number;
  endPrice?: number;
  whyLove: string;
  deadline?: string;
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

  const { data: jobPositions } = useFetch<PaginatedJobPositions, {}>(
    JobsAPI.getAllJobPositions,
    {}
  );
  const { data: jobCategories } = useFetch<PaginatedJobCategories, {}>(
    JobsAPI.getAllJobCategories,
    {}
  );
  const { data: workType } = useFetch<PaginatedWorkTypes, {}>(
    JobsAPI.getAllWorkTypes,
    {}
  );
  const { data: jobPlacements } = useFetch<JobPlacement, {}>(
    JobsAPI.getAllPlacements,
    {}
  );
  const { data: jobFields } = useFetch<PaginatedJobFields, {}>(
    JobsAPI.getAllJobFields,
    {}
  );

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
      const cleanValues = cleanFormValues(values);

      const deadline = values?.deadline
        ? dayjs(values.deadline).format('YYYY-MM-DD HH:mm:ss')
        : '';

      const payload = {
        ...cleanValues,
        description: values.description?.level?.content || '',
        requirements: values.requirements?.level?.content || '',
        benefits: values.benefits?.level?.content || '',
        deadline,
      };

      const response = await JobsAPI.postJob(payload);

      toast[response.statusCode === 200 ? 'success' : 'error'](
        response.message || 'Có lỗi xảy ra'
      );
      if (response.statusCode === 200) form.resetFields();
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const validateField = (name?: string) => {
    return (_: any, value: number | string) => {
      if (!value) {
        return Promise.reject(
          new Error(`Dữ liệu trường ${name} không được để trống`)
        );
      }

      return Promise.resolve();
    };
  };

  const formatter = (value: string | undefined): string => {
    if (!value) return '';
    return `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const parser = (value: string | undefined): string => {
    return value ? value.replace(/₫\s?|(,*)/g, '') : '';
  };

  return (
    <>
      {breadcrumb}
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="max-w-3xl mx-auto p-4 rounded-md border-none shadow gap-4"
      >
        <h2 className="text-xl font-bold mb-4">Thông tin cơ bản</h2>
        <Divider />
        <Form.Item
          name="title"
          label="Vị trí tuyển dụng"
          rules={[
            {
              required: true,
              validator: validateField('Vị trí tuyển dụng'),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="fieldsId"
          label="Lĩnh vực của vị trí tuyển dụng này là gì?"
          rules={[{ required: true, validator: validateField('Lĩnh vực') }]}
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
          name="categoriesId"
          label="Loại công việc"
          rules={[
            { required: true, validator: validateField('Loại công việc') },
          ]}
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
          name="workTypesId"
          label="Hình thức làm việc"
          rules={[
            { required: true, validator: validateField('Hình thức làm việc') },
          ]}
        >
          <Radio.Group className="flex flex-col gap-4">
            {workType?.items.map?.((type) => (
              <Radio value={type.id} key={type.id}>
                {type.title}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="positionsId"
          label="Cấp bậc"
          rules={[{ required: true, validator: validateField('Cấp bậc') }]}
        >
          <Select placeholder="Chọn cấp bậc">
            {jobPositions?.items.map?.((position) => (
              <Option key={position.id} value={position.id}>
                {position.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="placementIds"
          label="Địa điểm làm việc (tối đa 3 địa điểm)"
          rules={[{ required: true, validator: validateField('Địa điểm') }]}
        >
          <Select placeholder="Chọn địa điểm" mode="multiple" maxCount={3}>
            {jobPlacements?.items?.map((place) => (
              <Option key={place.id} value={place.id}>
                {place.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name={'quantity'}
          label="Số lượng tuyển dụng"
          className="mb-4"
          rules={[{ required: true, validator: validateField('Số lượng') }]}
        >
          <InputNumber
            prefix={<TeamOutlined />}
            className="w-full"
            placeholder="Số lượng cần tuyển"
            min={1}
          />
        </Form.Item>

        <Form.Item
          name={'deadline'}
          label="Hạn ứng tuyển"
          className="mb-4"
          rules={[
            { required: true, validator: validateField('Thời hạn ứng tuyển') },
          ]}
        >
          <DatePicker
            placeholder="Thời hạn ứng tuyển"
            className="w-full"
            format="DD-MM-YYYY"
            disabledDate={(current) =>
              current && current.isBefore(dayjs().startOf('day'))
            }
          />
        </Form.Item>

        <Form.Item label="Mức lương (không bắt buộc)" className="mb-4">
          <Input.Group compact>
            <Input.Group compact className="w-full">
              <Form.Item name={'salaryMin'} noStyle>
                <InputNumber
                  formatter={formatter}
                  parser={parser}
                  className="w-full"
                  placeholder="Từ mức lương"
                  suffix="VND"
                  min="1"
                />
              </Form.Item>
              <Form.Item name={'salaryMax'} noStyle>
                <InputNumber
                  formatter={formatter}
                  parser={parser}
                  className="w-full"
                  placeholder="Đến mức lương"
                  suffix="VND"
                  min="1"
                />
              </Form.Item>
            </Input.Group>
          </Input.Group>
          <p className="mt-2">
            <span className="text-gray-400">Ứng viên sẽ nhìn thấy:</span>
            <span className="italic text-red-500"> Thương lượng</span>
          </p>
        </Form.Item>

        <Form.Item label="Năm kinh nghiệm (không bắt buộc)" className="mb-4">
          <Input.Group compact>
            <Input.Group compact className="w-full">
              <Form.Item name={'minExpYearRequired'} noStyle>
                <InputNumber
                  className="w-full"
                  placeholder="Năm kinh nghiệm"
                  min={0}
                />
              </Form.Item>
              <Form.Item name={'maxExpYearRequired'} noStyle>
                <InputNumber
                  className="w-full"
                  placeholder="Năm kinh nghiệm"
                  min={0}
                />
              </Form.Item>
            </Input.Group>
          </Input.Group>
          <p className="mt-2">
            <span className="text-gray-400">Ứng viên sẽ nhìn thấy:</span>
            <span className="italic text-red-500"> Không yêu cầu</span>
          </p>
        </Form.Item>

        <Divider />

        <h2 className="text-xl font-bold mb-4">Mô tả công việc</h2>
        <Form.Item name="description" label="Mô tả công việc">
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
