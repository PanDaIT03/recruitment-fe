import { useMutation } from '@tanstack/react-query';
import {
  Divider,
  Flex,
  Image,
  Layout,
  message,
  Space,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { FormInstance, useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { DefaultOptionType } from 'antd/es/select';
import Title from 'antd/es/typography/Title';
import { FormItemProps } from 'antd/lib';
import dayjs from 'dayjs';
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

import { JobsAPI } from '~/apis/job';
import UserAPI, { IDesiredJobParams } from '~/apis/user';
import {
  ArrowLeft,
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
import CongratulationModal from '~/components/Modal/CongratulationModal';
import CustomSelect from '~/components/Select/CustomSelect';
import { useFetch } from '~/hooks/useFetch';
import { useAppDispatch } from '~/hooks/useStore';
import { getMe } from '~/store/thunk/auth';
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

type IForm = Omit<IDesiredJobParams, 'salaryExpectation'> & {
  cv: any;
  salaryExpectation: string;
};

export const startTimeOptions: DefaultOptionType[] = [
  { label: 'Bắt đầu ngay', value: 'Bắt đầu ngay' },
  { label: '1-2 tuần', value: '1-2 tuần' },
  { label: 'Sau 30 ngày', value: 'Sau 30 ngày' },
  { label: 'Sẽ thông báo khi có offer', value: 'Sẽ thông báo khi có offer' },
];

const { CloseOutlined, MinusCircleOutlined, StarOutlined } = icons;

const JobApplication = () => {
  const navigate = useNavigate();
  const [form] = useForm<IForm>();
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<UploadFile[]>([]);

  const { data: placements } = useFetch(
    ['allPlacements'],
    JobsAPI.getAllPlacements
  );

  const { data: jobFields } = useFetch(
    ['allJobsFields'],
    JobsAPI.getAllJobFields
  );

  const { data: jobPositions } = useFetch(
    ['jobPositions'],
    JobsAPI.getAllJobPositions
  );

  const { data: languages } = useFetch(
    ['foreignLanguage'],
    UserAPI.getAllForeignLanguage
  );

  const { mutate: uploadCV, isPending: isUploadCVPending } = useMutation({
    mutationFn: (params: FormData) => UserAPI.uploadCV(params),
    onSuccess: () => {
      const {
        cv,
        yearOfBirth,
        salaryExpectation,
        totalYearExperience,
        ...others
      } = form.getFieldsValue();

      const numericSalary = Number(salaryExpectation.replace(/[^0-9]/g, ''));
      const formattedParams: IDesiredJobParams = {
        salaryExpectation: numericSalary,
        totalYearExperience: Number(totalYearExperience),
        yearOfBirth: dayjs(yearOfBirth).format('YYYY'),
        ...others,
      };

      createNewDesiredJob(formattedParams);
    },
    onError: (error: any) =>
      message.error(error?.response?.data?.message || 'Lỗi khi upload CV'),
  });

  const { mutate: createNewDesiredJob, isPending: isCreateDesiredJobPending } =
    useMutation({
      mutationFn: (params: IDesiredJobParams) =>
        UserAPI.createNewDesiredJob(params),
      onSuccess: () => {
        dispatch(getMe());
        setIsOpenModal(true);
      },
      onError: (error: any) =>
        message.error(
          error?.response?.data?.message || 'Lỗi khi tạo công việc mong muốn'
        ),
    });

  const props: UploadProps = useMemo(
    () => ({
      name: 'file',
      maxCount: 1,
      fileList: uploadFile,
      onRemove: () => setUploadFile([]),
      beforeUpload: (file) => {
        const isValidFormat =
          file.type === 'application/pdf' ||
          file.type === 'application/msword' ||
          file.type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

        if (!isValidFormat) {
          message.error('Tệp tin không hợp lệ! Chỉ hỗ trợ PDF, DOC, DOCX.');
          return Upload.LIST_IGNORE;
        }

        const newFile: UploadFile[] = [
          { uid: file.uid, name: file.name, originFileObj: file },
        ];
        setUploadFile(newFile);
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

      form.setFieldValue('salaryExpectation', formattedValue);
    },
    []
  );

  const handleTotalYearChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value,
        numericValue = value.replace(/[^0-9]/g, '');

      form.setFieldValue('totalYearExperience', numericValue);
    },
    []
  );

  const handleBlurTotalYear = useCallback(
    (event: React.FocusEvent<HTMLInputElement, Element>) => {
      let formattedValue = '';
      const value = Number(event.target.value);

      if (value >= 50) formattedValue = '50';
      else formattedValue = value.toString();

      form.setFieldValue('totalYearExperience', formattedValue);
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
              name: 'jobFieldsId',
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
              rules: [
                {
                  required: true,
                  message: 'Vui lòng nhập lĩnh vực bạn muốn ứng tuyển',
                },
              ],
            },
            {
              name: 'jobPositionIds',
              required: true,
              label: 'Vị trí muốn ứng tuyển? (Tối đa 3 vị trí)',
              listItem: {
                length: 3,
                buttonTitle: 'Thêm vị trí muốn ứng tuyển',
                render: (params) => {
                  const { fields, func } = params;
                  if (fields.length === 0) func.add();

                  return fields.map((field) => (
                    <FormItem
                      {...field}
                      key={field.key}
                      className="mb-3"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng chọn vị trí muốn ứng tuyển',
                        },
                      ]}
                    >
                      <CustomSelect
                        prefixIcon={<BackPack />}
                        placeholder="Chọn vị trí ứng truyển"
                        options={jobPositions?.items?.map((jobPosition) => ({
                          label: jobPosition.title,
                          value: jobPosition.id,
                        }))}
                        suffixIcon={
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
              name: 'jobPlacementIds',
              required: true,
              label: 'Nơi bạn mong muốn tìm việc? (Tối đa 3 địa điểm)',
              rules: [
                {
                  validator: (_, value) => {
                    if (!value?.length)
                      return Promise.reject('Vui lòng chọn địa điểm làm việc');

                    if (value?.length > 3)
                      return Promise.reject('Chỉ được chọn tối đa 3 địa điểm');

                    return Promise.resolve();
                  },
                },
              ],
              item: (
                <CustomSelect
                  allowClear
                  maxCount={3}
                  mode="multiple"
                  placeholder="Chọn thành phố"
                  options={placements?.items?.map((place) => ({
                    value: place?.id,
                    label: place?.title,
                  }))}
                  prefixIcon={<Location />}
                />
              ),
            },
            {
              name: 'salaryExpectation',
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
            },
            {
              name: 'startAfterOffer',
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
              name: 'totalYearExperience',
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
              rules: [
                { required: true, message: 'Vui lòng nhập số năm kinh nghiệm' },
              ],
            },
            {
              name: 'yearOfBirth',
              label: 'Năm sinh',
              item: <DatePicker picker="year" placeholder="Ví dụ: 2000" />,
              rules: [
                { required: true, message: 'Vui lòng chọn năm sinh của bạn' },
              ],
            },
            {
              name: 'foreignLanguages',
              required: true,
              label: 'Khả năng ngoại ngữ (Tối đa 4 ngoại ngữ)',
              listItem: {
                length: 4,
                buttonTitle: 'Thêm ngoại ngữ',
                render: (params) => {
                  const { fields, func } = params;
                  if (fields.length === 0) func.add();

                  return fields.map(({ key, name }) => (
                    <Flex
                      wrap
                      gap={8}
                      key={key}
                      className="mb-3 max-sm:border max-sm:border-dashed max-sm:p-4 max-sm:rounded-md max-sm:flex-col"
                    >
                      <FormItem
                        name={[name, 'id']}
                        className="m-0 max-w-[180px]"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng chọn khả năng ngoại ngữ',
                          },
                        ]}
                      >
                        <CustomSelect
                          placeholder="Chọn ngoại ngữ"
                          options={languages?.items.map((language) => ({
                            label: (
                              <Flex align="center" gap={16}>
                                <Image
                                  width={16}
                                  height={16}
                                  preview={false}
                                  src={language?.imageUrl}
                                />
                                <span>{language?.title}</span>
                              </Flex>
                            ),
                            value: language.id,
                          }))}
                          prefixIcon={<Language width={14} height={14} />}
                        />
                      </FormItem>
                      <Flex
                        gap={8}
                        align="center"
                        className="flex-1 max-sm:flex-wrap"
                      >
                        <FormItem
                          name={[name, 'level']}
                          className="m-0 sm:min-w-[250px]"
                        >
                          <CustomSelect
                            options={advanceOptions}
                            placeholder="Chọn trình độ"
                            prefixIcon={<StarOutlined width={14} height={14} />}
                          />
                        </FormItem>
                        {fields.length > 1 && (
                          <Button
                            borderType="dashed"
                            title={
                              <MinusCircleOutlined className="flex text-xl" />
                            }
                            onClick={() => func.remove(name)}
                          />
                        )}
                      </Flex>
                    </Flex>
                  ));
                },
              },
            },
            {
              name: 'achivements',
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
              rules: [{ required: true, message: 'Vui lòng nhập tóm tắt' }],
            },
            {
              name: 'cv',
              className: 'mt-12',
              label: 'Hồ sơ xin việc / CV',
              item: <Dragger {...props} maxCount={1} />,
              rules: [
                { required: true, message: 'Vui lòng tải lên CV của bạn' },
              ],
            },
          ],
        },
      ],
    };
  }, [
    form,
    props,
    jobFields,
    placements,
    languages,
    jobPositions,
    advanceOptions,
  ]);

  const handleUploadCV = useCallback(async () => {
    if (!uploadFile.length) return;

    const formData = new FormData();
    uploadFile.forEach((item) => {
      if (!item.originFileObj) return;
      formData.append('files', item.originFileObj);
    });

    uploadCV(formData);
  }, [uploadFile]);

  useEffect(() => {
    const { jobPositionIds, foreignLanguages } = form.getFieldsValue();

    if (jobPositionIds?.[0] === undefined)
      form.setFieldValue('jobPositionIds', [undefined]);

    if (foreignLanguages?.[0] === undefined)
      form.setFieldValue('foreignLanguages', [undefined]);
  }, []);

  return (
    <Layout className="w-full min-h-screen">
      <Flex vertical gap={24}>
        <FormWrapper form={form} onFinish={handleUploadCV}>
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
            loading={isUploadCVPending || isCreateDesiredJobPending}
            onClick={() => navigate(PATH.USER_PROFILE)}
          />
          <Button
            fill
            title="Tạo hồ sơ"
            className="w-full"
            iconAfter={<Fly />}
            loading={isUploadCVPending || isCreateDesiredJobPending}
            onClick={() => form.submit()}
          />
        </Flex>
      </Flex>
      <CongratulationModal
        isOpen={isOpenModal}
        footer={
          <Button
            className="w-full"
            title="Quay về trang hồ sơ"
            iconBefore={<ArrowLeft />}
            onClick={() => navigate(PATH.USER_DESIRED_JOB)}
          />
        }
      >
        <Space direction="vertical" align="center" className="text-center">
          <h2 className="text-lg font-semibold">
            Hồ sơ của bạn đã được tạo thành công
          </h2>
          <p className="font-medium text-sub">
            Trong vòng 1-2 ngày làm việc tiếp theo, chúng tôi sẽ đánh giá hồ sơ
            tìm việc của bạn để có thể giới thiệu đến các doanh nghiệp phù hợp.
          </p>
        </Space>
      </CongratulationModal>
    </Layout>
  );
};

export default JobApplication;
