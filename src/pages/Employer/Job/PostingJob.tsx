import { Editor } from '@tinymce/tinymce-react';
import { DatePicker, Divider, Form, Input, InputNumber, Radio } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { JobsAPI } from '~/apis/job';
import Button from '~/components/Button/Button';
import CustomSelect from '~/components/Select/CustomSelect';
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
      label: 'Công việc',
    },
    {
      path: PATH.EMPLOYER_POSTING,
      label: 'Đăng tin',
    },
  ];

  const breadcrumb = useBreadcrumb(customBreadcrumbItems, 'text-white');

  const jobPositions = useFetch<PaginatedJobPositions>(
    ['jobPositions'],
    JobsAPI.getAllJobPositions
  );

  const jobCategories = useFetch<PaginatedJobCategories>(
    ['jobCategories'],
    JobsAPI.getAllJobCategories
  );

  const workTypes = useFetch<PaginatedWorkTypes>(
    ['workTypes'],
    JobsAPI.getAllWorkTypes
  );

  const jobPlacements = useFetch<JobPlacement>(
    ['placements'],
    JobsAPI.getAllPlacements
  );

  const jobFields = useFetch<PaginatedJobFields>(
    ['jobFields'],
    JobsAPI.getAllJobFields
  );

  const positions = useMemo(() => {
    return jobPositions.data?.items.map((positions) => ({
      value: positions.id,
      label: positions.title,
    }));
  }, [jobPositions]);

  const categories = useMemo(() => {
    return jobCategories.data?.items.map((categories) => ({
      value: categories.id,
      label: categories.name,
    }));
  }, [jobCategories]);

  const types = useMemo(() => {
    return workTypes.data?.items.map((types) => ({
      value: types.id,
      label: types.title,
    }));
  }, [workTypes]);

  const placements = useMemo(() => {
    return jobPlacements.data?.items.map((placements) => ({
      value: placements.id,
      label: placements.title,
    }));
  }, [jobPlacements]);

  const fields = useMemo(() => {
    return jobFields.data?.items.map((fields) => ({
      value: fields.id,
      label: fields.title,
    }));
  }, [jobFields]);

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
      <div className="bg-secondary border-t border-[#561d59]">
        <p className="px-16 w-full py-2">{breadcrumb}</p>
      </div>
      <div className="p-4">
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className="max-w-3xl mx-auto p-4 rounded-md border-none shadow gap-4 bg-white"
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
            <Input
              size="large"
              className="bg-light-gray"
              placeholder="Ví dụ: SEO Marketing"
            />
          </Form.Item>

          <Form.Item
            name="fieldsId"
            label="Lĩnh vực của vị trí tuyển dụng này là gì?"
            rules={[{ required: true, validator: validateField('Lĩnh vực') }]}
          >
            <CustomSelect
              placeholder="Chọn danh mục"
              options={fields || []}
            ></CustomSelect>
          </Form.Item>

          <Form.Item
            name="categoriesId"
            label="Loại công việc"
            rules={[
              { required: true, validator: validateField('Loại công việc') },
            ]}
          >
            <Radio.Group
              className="flex flex-col gap-4"
              options={categories}
            ></Radio.Group>
          </Form.Item>

          <Form.Item
            name="workTypesId"
            label="Hình thức làm việc"
            rules={[
              {
                required: true,
                validator: validateField('Hình thức làm việc'),
              },
            ]}
          >
            <Radio.Group
              className="flex flex-col gap-4"
              options={types || []}
            ></Radio.Group>
          </Form.Item>

          <Form.Item
            name="positionsId"
            label="Cấp bậc"
            rules={[{ required: true, validator: validateField('Cấp bậc') }]}
          >
            <CustomSelect
              title="Chọn cấp bậc"
              options={positions || []}
              placeholder="Chọn cấp bậc"
            />
          </Form.Item>

          <Form.Item
            name="placementIds"
            label="Địa điểm làm việc (tối đa 3 địa điểm)"
            rules={[{ required: true, validator: validateField('Địa điểm') }]}
          >
            <CustomSelect
              placeholder="Chọn địa điểm"
              options={placements || []}
              mode="multiple"
              maxCount={3}
            ></CustomSelect>
          </Form.Item>

          <Form.Item
            name={'quantity'}
            label="Số lượng tuyển dụng"
            className="mb-4"
            rules={[{ required: true, validator: validateField('Số lượng') }]}
          >
            <InputNumber
              prefix={<TeamOutlined />}
              size="large"
              className="w-full bg-light-gray"
              placeholder="Số lượng cần tuyển"
              min={1}
            />
          </Form.Item>

          <Form.Item
            name={'deadline'}
            label="Hạn ứng tuyển"
            className="mb-4"
            rules={[
              {
                required: true,
                validator: validateField('Thời hạn ứng tuyển'),
              },
            ]}
          >
            <DatePicker
              placeholder="Thời hạn ứng tuyển"
              size="large"
              className="w-full bg-light-gray"
              format="DD-MM-YYYY"
              disabledDate={(current) =>
                current && current.isBefore(dayjs().startOf('day'))
              }
            />
          </Form.Item>

          <Form.Item label="Mức lương (không bắt buộc)" className="mb-4">
            <Input.Group compact>
              <Input.Group compact className="w-full">
                <Form.Item
                  name={'salaryMin'}
                  noStyle
                  rules={[
                    {
                      validator: (_, value) => {
                        const maxSalary = form.getFieldValue('salaryMax');
                        if (value && maxSalary && value >= maxSalary) {
                          return Promise.reject(
                            new Error(
                              'Mức lương tối thiểu phải nhỏ hơn mức lương tối đa'
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber
                    formatter={formatter}
                    parser={parser}
                    className="w-full bg-light-gray"
                    size="large"
                    placeholder="Từ mức lương"
                    suffix="VND"
                    min="1"
                  />
                </Form.Item>
                <Form.Item
                  name={'salaryMax'}
                  noStyle
                  rules={[
                    {
                      validator: (_, value) => {
                        const minSalary = form.getFieldValue('salaryMin');
                        if (value && minSalary && value <= minSalary) {
                          return Promise.reject(
                            new Error(
                              'Mức lương tối đa phải lớn hơn mức lương tối thiểu'
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber
                    formatter={formatter}
                    parser={parser}
                    className="w-full bg-light-gray"
                    size="large"
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
                <Form.Item
                  name={'minExpYearRequired'}
                  noStyle
                  rules={[
                    {
                      validator: (_, value) => {
                        const maxExp = form.getFieldValue('maxExpYearRequired');
                        if (value && maxExp && value > maxExp) {
                          return Promise.reject(
                            new Error(
                              'Kinh nghiệm tối thiểu không được lớn hơn kinh nghiệm tối đa'
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber
                    className="w-full bg-light-gray"
                    size="large"
                    placeholder="Năm kinh nghiệm"
                    min={0}
                  />
                </Form.Item>
                <Form.Item
                  name={'maxExpYearRequired'}
                  noStyle
                  rules={[
                    {
                      validator: (_, value) => {
                        const minExp = form.getFieldValue('minExpYearRequired');
                        if (value && minExp && value < minExp) {
                          return Promise.reject(
                            new Error(
                              'Kinh nghiệm tối đa không được nhỏ hơn kinh nghiệm tối thiểu'
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber
                    className="w-full bg-light-gray"
                    size="large"
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
      </div>
    </>
  );
};

export default PostingJob;
