import {
  Divider,
  Flex,
  Layout,
  message,
  Space,
  UploadFile,
  UploadProps,
} from 'antd';
import { FormInstance, useForm } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import Title from 'antd/es/typography/Title';
import { FormItemProps } from 'antd/lib';
import {
  ChangeEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import TextArea from 'antd/es/input/TextArea';
import { JobsAPI } from '~/apis/job';
import UserApi from '~/apis/user';
import {
  BackPack,
  Box,
  Calendar,
  Fly,
  Language,
  Location,
  Salary,
  SunRise,
} from '~/assets/svg';
import Button from '~/components/Button/Button';
import { DatePicker } from '~/components/DatePicker/DatePicker';
import Dragger from '~/components/Dragger/Dragger';
import FormItem from '~/components/Form/FormItem';
import { IFormListProps } from '~/components/Form/FormList';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import CustomSelect from '~/components/Select/CustomSelect';
import { useFetch } from '~/hooks/useFetch';
import { formatCurrencyVN } from '~/utils/functions';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import { advanceOptions } from '../Profile/Modal/LanguageModal';
import FormJobApplication from './FormJobApplication';

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

export const startTimeOptions: DefaultOptionType[] = [
  { label: 'Bắt đầu ngay', value: 'immediately' },
  { label: '1-2 tuần', value: '1-2_weeks' },
  { label: '30 ngày', value: '30_days' },
  { label: 'Sẽ thông báo khi có offer', value: 'upon_offer' },
];

const initUploadFile = {} as UploadFile;
const { CloseOutlined, MinusCircleOutlined, StarOutlined } = icons;

const JobApplication = () => {
  const navigate = useNavigate();
  const [form] = useForm();

  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<UploadFile>(initUploadFile);

  const { data: placements } = useFetch(
    ['allPlacements'],
    JobsAPI.getAllPlacements
  );

  const { data: jobFields } = useFetch(
    ['allJobsFields'],
    JobsAPI.getAllJobFields
  );

  const { data: languages } = useFetch(
    ['foreignLanguage'],
    UserApi.getAllForeignLanguage
  );

  const props: UploadProps = useMemo(
    () => ({
      uploadFile,
      name: 'file',
      maxCount: 1,
      onRemove: () => setUploadFile(initUploadFile),
      beforeUpload: (file) => {
        const isValidFormat =
          file.type === 'application/pdf' ||
          file.type === 'application/msword' ||
          file.type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

        if (!isValidFormat)
          message.error('Tệp tin không hợp lệ! Chỉ hỗ trợ PDF, DOC, DOCX.');

        setUploadFile({ ...file, name: file.name, originFileObj: file });
        return false;
      },
    }),
    [uploadFile]
  );

  const handleSalaryChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value,
        numericValue = value.replace(/[^0-9]/g, '');

      let formattedValue = '';
      if (numericValue) formattedValue = formatCurrencyVN(Number(numericValue));

      form.setFieldValue('salary', formattedValue);
    },
    []
  );

  const handleTotalYearChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value,
        numericValue = value.replace(/[^0-9]/g, '');

      form.setFieldValue('totalYearsOfExp', numericValue);
    },
    []
  );

  const handleBlurTotalYear = useCallback(
    (event: React.FocusEvent<HTMLInputElement, Element>) => {
      let formattedValue = '';
      const value = Number(event.target.value);

      if (value >= 50) formattedValue = '50';
      else formattedValue = value.toString();

      form.setFieldValue('totalYearsOfExp', formattedValue);
    },
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
                <CustomSelect
                  allowClear
                  placeholder="Lĩnh vực"
                  prefixIcon={<Box />}
                  options={jobFields?.items.map((jobField) => ({
                    label: jobField.title,
                    value: jobField.id,
                  }))}
                />
              ),
              // rules: [{ required: true, message: 'Hãy nhập email' }],
            },
            {
              name: 'positions',
              required: true,
              label: 'Vị trí muốn ứng tuyển? (Tối đa 3 vị trí)',
              listItem: {
                length: 3,
                buttonTitle: 'Thêm vị trí muốn ứng tuyển',
                render: (params) => {
                  const { fields, func } = params;

                  return fields.map((field) => (
                    <FormItem {...field} key={field.key} className="mb-3">
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
              name: 'placements',
              label: 'Nơi bạn mong muốn tìm việc? (Tối đa 3 địa điểm)',
              rules: [
                {
                  validator: (_, value) => {
                    if (!value.length) return Promise.resolve();

                    if (value.length > 3)
                      return Promise.reject('Chỉ được chọn tối đa 3 địa điểm');

                    return Promise.resolve();
                  },
                },
              ],
              item: (
                <CustomSelect
                  allowClear
                  mode="multiple"
                  placeholder="Chọn thành phố"
                  options={placements?.items?.map((place) => ({
                    value: place?.id,
                    label: place?.title,
                  }))}
                  prefixIcon={<Location />}
                />
              ),
              // rules: [{ required: true, message: 'Vui lòng chọn địa điểm' }],
            },
            {
              name: 'salary',
              label: 'Mức lương kỳ vọng (VNĐ)',
              item: (
                <Input
                  inputMode="numeric"
                  prefix={<Salary />}
                  placeholder="Ví dụ: 30.000.000"
                  onChange={handleSalaryChange}
                />
              ),
              extra: 'Để trống nếu bạn muốn thương lượng sau.',
              // rules: [{ required: true, message: 'Vui lòng nhập mức lương' }],
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
              // rules: [
              //   {
              //     required: true,
              //     message: 'Vui lòng chọn thời gian bắt đầu làm việc',
              //   },
              // ],
            },
          ],
        },
        {
          title: 'Thông tin & kinh nghiệm của bạn',
          items: [
            {
              name: 'totalYearsOfExp',
              label: 'Tổng số năm kinh nghiệm của bạn',
              item: (
                <Input
                  inputMode="numeric"
                  prefix={<SunRise />}
                  placeholder="Ví dụ: 7"
                  onChange={handleTotalYearChange}
                  onBlur={(e) => handleBlurTotalYear(e)}
                />
              ),
              // rules: [
              //   { required: true, message: 'Hãy nhập số năm kinh nghiệm' },
              // ],
            },
            {
              name: 'yearOfBirth',
              label: 'Năm sinh',
              item: <DatePicker picker="year" placeholder="Ví dụ: 2000" />,
              // rules: [{ required: true, message: 'Hãy chọn năm sinh của bạn' }],
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
                    <Flex
                      wrap
                      key={key}
                      gap={8}
                      className="mb-3 max-sm:border max-sm:border-dashed max-sm:p-4 max-sm:rounded-md"
                    >
                      <FormItem
                        name={[name, 'language']}
                        className="m-0 max-w-[180px]"
                      >
                        <CustomSelect
                          placeholder="Chọn ngoại ngữ"
                          options={languages?.items.map((language) => ({
                            label: language.title,
                            value: language.id,
                          }))}
                          prefixIcon={<Language width={14} height={14} />}
                        />
                      </FormItem>
                      <Flex gap={8} align="center" className="flex-1">
                        <FormItem
                          name={[name, 'advance']}
                          className="w-full m-0 min-w-[250px]"
                        >
                          <CustomSelect
                            options={advanceOptions}
                            placeholder="Chọn trình độ"
                            prefixIcon={<StarOutlined width={14} height={14} />}
                          />
                        </FormItem>
                        <Button
                          borderType="dashed"
                          title={
                            <MinusCircleOutlined className="flex text-xl" />
                          }
                          onClick={() => func.remove(name)}
                        />
                      </Flex>
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
                  className="p-3 !min-h-32 bg-light-gray"
                />
              ),
              // rules: [{ required: true, message: 'Vui lòng nhập tóm tắt' }],
            },
            {
              name: 'cv',
              className: 'mt-12',
              label: 'Hồ sơ xin việc / CV',
              item: <Dragger {...props} maxCount={1} />,
              // rules: [
              //   { required: true, message: 'Vui lòng tải lên CV của bạn' },
              // ],
            },
          ],
        },
      ],
    };
  }, [form, props, languages, jobFields, placements]);

  useEffect(() => {
    const positions = form.getFieldValue('positions');

    if (!positions || positions.length === 0)
      form.setFieldsValue({ positions: [''] });
  }, []);

  const handleUploadCV = useCallback(async () => {
    if (!Object.keys(uploadFile).length || !uploadFile?.originFileObj) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', uploadFile.originFileObj);

    try {
      // const response = await JobsAPI.ApplyJob(formData);
      // setFileList([]);
      // message.success(response?.message);
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setUploading(false);
    }
  }, [uploadFile]);

  const handleFinish = async (values: any) => {
    await handleUploadCV();
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
                  <FormJobApplication formItems={item.items} />
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
            loading={uploading}
            onClick={() => form.submit()}
          />
        </Flex>
      </Flex>
    </Layout>
  );
};

export default JobApplication;
