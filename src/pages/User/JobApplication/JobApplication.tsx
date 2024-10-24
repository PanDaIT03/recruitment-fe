import { Divider, Flex, Layout, Space } from 'antd';
import { FormInstance, useForm } from 'antd/es/form/Form';
import { FormItemProps } from 'antd/lib';
import { ReactElement, ReactNode, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Fly } from '~/assets/svg';
import Button from '~/components/Button/Button';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import InputNumber from '~/components/Input/InputNumber';
import Select from '~/components/Select/Select';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import FormApplication from './FormApplication';
import Title from 'antd/es/typography/Title';
import { DatePicker } from '~/components/DatePicker/DatePicker';
import { DefaultOptionType } from 'antd/es/select';

export type IApplicationFormItem = {
  name: string;
  formList?: boolean;
  formItem: ReactElement;
  component?: ReactNode;
} & FormItemProps;

export type IJobApplicationForm = {
  form: FormInstance;
  children: Array<{
    title: ReactNode;
    items: IApplicationFormItem[];
  }>;
};

const { CloseOutlined } = icons;

const languageOptions: DefaultOptionType[] = [
  { label: 'Eng', value: 'eng' },
  { label: 'Vie', value: 'vie' },
];

const advancedOptions: DefaultOptionType[] = [
  { label: 'Cơ bản', value: 'basic' },
  { label: 'Nâng cao', value: 'advance' },
];

const JobApplication = () => {
  const navigate = useNavigate();
  const [form] = useForm();

  useEffect(() => {
    const positions = form.getFieldValue('positions');

    if (!positions || positions.length === 0)
      form.setFieldsValue({ positions: [''], foreignLanguages: [''] });
  }, []);

  const formItem: IJobApplicationForm = useMemo(() => {
    return {
      form: form,
      children: [
        {
          title: 'Công việc mong muốn',
          items: [
            {
              name: 'field',
              label: 'Lĩnh vực bạn muốn ứng tuyển?',
              formItem: <Select placeholder="Lĩnh vực" />,
              // rules: [{ required: true, message: 'Hãy nhập email' }],
            },
            {
              formList: true,
              name: 'positions',
              label: 'Vị trí muốn ứng tuyển? (Tối đa 3 vị trí)',
              formItem: (
                <Input
                  allowClear
                  className="w-full"
                  placeholder="Ví dụ: Marketing"
                />
              ),
              // rules: [{ required: true, message: 'Vui nhập vị trí ứng tuyển' }],
            },
            {
              name: 'placement',
              label: 'Nơi bạn mong muốn tìm việc? (Tối đa 3 địa điểm)',
              formItem: <Select placeholder="Chọn thành phố" />,
              // rules: [{ required: true, message: 'Vui chọn địa điểm' }],
            },
            {
              name: 'salary',
              label: 'Mức lương kỳ vọng (VNĐ)',
              formItem: <InputNumber />,
              help: 'Để trống nếu bạn muốn thương lượng sau.',
              // rules: [{ required: true, message: 'Vui chọn địa điểm' }],
            },
            {
              name: 'time',
              label: 'Thời gian có thể bắt đầu làm việc kể từ khi nhận offer?',
              formItem: <Select placeholder="Chọn thời gian" />,
              className: 'mt-[46px] mb-0',
              // rules: [{ required: true, message: 'Vui chọn địa điểm' }],
            },
          ],
        },
        {
          title: 'Thông tin & kinh nghiệm của bạn',
          items: [
            {
              name: 'totalYearsOfExp',
              label: 'Tổng số năm kinh nghiệm của bạn',
              formItem: <InputNumber />,
              // rules: [{ required: true, message: 'Hãy nhập email' }],
            },
            {
              name: 'yearOfBirth',
              label: 'Năm sinh',
              formItem: <DatePicker picker="year" />,
              // rules: [{ required: true, message: 'Hãy nhập email' }],
            },
            {
              formList: true,
              name: 'foreignLanguages',
              label: 'Khả năng ngoại ngữ (Tối đa 4 ngoại ngữ)',
              formItem: <Select options={languageOptions} />,
              // rules: [{ required: true, message: 'Hãy nhập email' }],
            },
          ],
        },
      ],
    };
  }, []);

  const handleFinish = (values: any) => {
    console.log(values);
  };

  return (
    <Layout className="w-full min-h-screen">
      <Flex vertical gap={24}>
        <FormWrapper form={form} onFinish={handleFinish}>
          <Space direction="vertical" size="large" className="w-full">
            {formItem.children.map((item, index) => (
              <div
                key={index}
                className="w-full bg-white border rounded-xl shadow-md"
              >
                <Title
                  level={5}
                  className="text-base font-semibold py-4 px-6 !mb-0"
                >
                  {item.title}
                </Title>
                <Divider className="!m-0" />
                <div className="p-6">
                  <FormApplication formItems={item.items} />
                </div>
              </div>
            ))}
          </Space>
        </FormWrapper>
        <Flex gap={12}>
          <Button
            title="Để sau"
            displayType="outline"
            iconBefore={<CloseOutlined />}
            onClick={() => navigate(PATH.USER_PROFILE)}
          />
          <Button
            fill
            title="Tạo hồ sơ"
            className="w-full"
            iconAfter={<Fly />}
            onClick={() => form.submit()}
          />
        </Flex>
      </Flex>
    </Layout>
  );
};

export default JobApplication;
