import { Divider, Flex, Layout, Space, UploadProps } from 'antd';
import { FormInstance, useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { DefaultOptionType } from 'antd/es/select';
import Title from 'antd/es/typography/Title';
import { FormItemProps } from 'antd/lib';
import { ReactElement, ReactNode, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { JobsAPI } from '~/apis/job';
import UserApi from '~/apis/user';
import {
  BackPack,
  Box,
  Calendar,
  Fly,
  Location,
  Salary,
  SunRise
} from '~/assets/svg';
import Button from '~/components/Button/Button';
import { DatePicker } from '~/components/DatePicker/DatePicker';
import Dragger from '~/components/Dragger/Dragger';
import FormItem from '~/components/Form/FormItem';
import { IFormListProps } from '~/components/Form/FormList';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import InputNumber from '~/components/Input/InputNumber';
import CustomSelect from '~/components/Select/CustomSelect';
import Select from '~/components/Select/Select';
import { useFetch } from '~/hooks/useFetch';
import { JobPlacement } from '~/types/Job';
import toast from '~/utils/functions/toast';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import { advanceOptions } from '../Profile/Modal/LanguageModal';
import FormApplication from './FormApplication';

export type IApplicationFormItem = {
  name: string;
  item?: ReactElement;
  listItem?: IFormListProps;
} & FormItemProps;

export type IJobApplicationForm = {
  form: FormInstance;
  children: Array<{
    title: ReactNode;
    items: IApplicationFormItem[];
  }>;
};

const { CloseOutlined, MinusCircleOutlined } = icons;

const startTimeOptions: DefaultOptionType[] = [
  { label: 'Bắt đầu ngay', value: 'immediately' },
  { label: '1-2 tuần', value: '1-2_weeks' },
  { label: '30 ngày', value: '30_days' },
  { label: 'Sẽ thông báo khi có offer', value: 'upon_offer' },
];

const JobApplication = () => {
  const navigate = useNavigate();
  const [form] = useForm();

  const { data: languages } = useFetch(UserApi.getAllForeignLanguage);
  const { data: placements } = useFetch<JobPlacement>(JobsAPI.getAllPlacements);

  const props: UploadProps = useMemo(
    () => ({
      name: 'file',
      multiple: true,
      action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
      onChange: (info) => {
        const { status } = info.file;
        if (status !== 'uploading') console.log(info.file, info.fileList);

        if (status === 'done')
          toast.success(`${info.file.name} file uploaded successfully.`);
        else if (status === 'error')
          toast.error(`${info.file.name} file upload failed.`);
      },
      onDrop: (e) => {
        console.log('Dropped files', e.dataTransfer.files);
      },
    }),
    []
  );

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
              item: (
                <CustomSelect placeholder="Lĩnh vực" prefixIcon={<Box />} />
              ),
              // rules: [{ required: true, message: 'Hãy nhập email' }],
            },
            {
              name: 'positions',
              label: 'Vị trí muốn ứng tuyển? (Tối đa 3 vị trí)',
              listItem: {
                length: 3,
                buttonTitle: 'Thêm vị trí muốn ứng tuyển',
                render: (params) => {
                  const { fields, func } = params;

                  return fields.map((field) => (
                    <FormItem
                      {...field}
                      key={field.key}
                      className="mb-3"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập vị trí ứng tuyển',
                        },
                      ]}
                    >
                      <Input
                        allowClear
                        className="w-full"
                        placeholder="Ví dụ: Marketing"
                        prefix={<BackPack />}
                        suffix={
                          fields.length > 1 && (
                            <CloseOutlined
                              className="p-2 text-[#f15224] text-base rounded-full cursor-pointer hover:bg-[#fcebe6]"
                              onClick={() => func.remove(field.name)}
                            />
                          )
                        }
                      />
                    </FormItem>
                  ));
                },
              },
            },
            {
              name: 'placement',
              label: 'Nơi bạn mong muốn tìm việc? (Tối đa 3 địa điểm)',
              item: (
                <CustomSelect
                  placeholder="Chọn thành phố"
                  options={placements?.items?.map((place) => ({
                    value: place?.id,
                    label: place?.title,
                  }))}
                  prefixIcon={<Location />}
                />
              ),
              rules: [{ required: true, message: 'Vui lòng chọn địa điểm' }],
            },
            {
              name: 'salary',
              label: 'Mức lương kỳ vọng (VNĐ)',
              item: (
                <InputNumber
                  prefix={<Salary />}
                  placeholder="Ví dụ: 30,000,000"
                />
              ),
              extra: 'Để trống nếu bạn muốn thương lượng sau.',
              rules: [{ required: true, message: 'Vui lòng nhập mức lương' }],
            },
            {
              name: 'time',
              label: 'Thời gian có thể bắt đầu làm việc kể từ khi nhận offer?',
              className: 'mb-0',
              item: (
                <CustomSelect
                  placeholder="Chọn thời gian"
                  options={startTimeOptions}
                  prefixIcon={<Calendar width={16} height={16} />}
                />
              ),
              rules: [
                {
                  required: true,
                  message: 'Vui lòng chọn thời gian bắt đầu làm việc',
                },
              ],
            },
          ],
        },
        {
          title: 'Thông tin & kinh nghiệm của bạn',
          items: [
            {
              name: 'totalYearsOfExp',
              label: 'Tổng số năm kinh nghiệm của bạn',
              item: <InputNumber prefix={<SunRise />} placeholder="Ví dụ: 7" />,
              rules: [
                { required: true, message: 'Hãy nhập số năm kinh nghiệm' },
              ],
            },
            {
              name: 'yearOfBirth',
              label: 'Năm sinh',
              item: <DatePicker picker="year" placeholder="Ví dụ: 2000" />,
              rules: [{ required: true, message: 'Hãy chọn năm sinh của bạn' }],
            },
            {
              name: 'foreignLanguages',
              label: 'Khả năng ngoại ngữ (Tối đa 4 ngoại ngữ)',
              listItem: {
                length: 4,
                buttonTitle: 'Thêm ngoại ngữ',
                render: (params) => {
                  const { fields, func } = params;

                  return fields.map(({ key, name }) => (
                    <Flex key={key} gap={12} className="mb-3">
                      <div className="w-full grid grid-cols-4 gap-2">
                        <FormItem
                          name={[name, 'language']}
                          className="col-span-1 m-0"
                        >
                          <Select
                            placeholder="Chọn ngoại ngữ"
                            options={languages?.items.map((language) => ({
                              label: language.title,
                              value: language.id,
                            }))}
                          />
                        </FormItem>
                        <FormItem
                          name={[name, 'advance']}
                          className="col-span-3 m-0"
                        >
                          <Select
                            options={advanceOptions}
                            placeholder="Chọn trình độ"
                          />
                        </FormItem>
                      </div>
                      <Button
                        borderType="dashed"
                        title={<MinusCircleOutlined className="flex text-xl" />}
                        onClick={() => func.remove(name)}
                      />
                    </Flex>
                  ));
                },
              },
            },
            {
              name: 'summary',
              label:
                'Tóm tắt 3-5 thành tựu hoặc lý do nổi bật khiến nhà tuyển dụng chọn bạn?',
              extra:
                'Không phải nhà tuyển dụng nào cũng đọc CV của bạn, họ thường tập trung vào những kỹ năng/thành tích của bạn, nếu họ thấy ấn tượng, họ mới đọc CV. Vì vậy hãy viết thật thu hút và chỉnh chu ở phần này nhé.',
              item: (
                <TextArea
                  placeholder={`Ví dụ:\n- Tốt nghiệp loại giỏi chuyên ngành Quản trị Nhân lực với GPA 3.53/4.00\n- Đạt 100% KPI trong thời gian thử việc, vượt 119% KPI chung trong Quý 2.2022\n- Mang về mỗi tháng lên tới 30 khách hàng tương đương 40% doanh thu năm 2023`}
                  className="p-3 !min-h-32"
                />
              ),
              rules: [{ required: true, message: 'Vui lòng nhập tóm tắt' }],
            },
            {
              name: 'cv',
              className: 'mt-12',
              label: 'Hồ sơ xin việc / CV',
              item: <Dragger {...props} />,
              rules: [
                { required: true, message: 'Vui lòng tải lên CV của bạn' },
              ],
            },
          ],
        },
      ],
    };
  }, [languages, placements]);

  useEffect(() => {
    const positions = form.getFieldValue('positions');

    if (!positions || positions.length === 0)
      form.setFieldsValue({ positions: [''] });
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
