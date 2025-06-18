import { useMutation } from '@tanstack/react-query';
import { FormItemProps, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import {
  ChangeEvent,
  Dispatch,
  memo,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { DesiredJobAPI, IUpdateDesiredJobParams } from '~/apis/desiredJob';
import { JobsAPI } from '~/apis/job';
import UserAPI from '~/apis/user';
import { BackPack, Box, Salary } from '~/assets/svg';
import FormItem from '~/components/Form/FormItem';
import FormList, { IFormListProps } from '~/components/Form/FormList';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import Modal, { IModalProps } from '~/components/Modal/Modal';
import CustomSelect from '~/components/Select/CustomSelect';
import Select from '~/components/Select/Select';
import TextArea from '~/components/TextArea/TextArea';
import { useFetch } from '~/hooks/useFetch';
import { IDesiredJob } from '~/types/DesiredJob';
import { formatCurrencyVN } from '~/utils/functions';
import icons from '~/utils/icons';
import { startTimeOptions } from '../JobApplication/JobApplication';

interface IProps extends IModalProps {
  isOpen: boolean;
  data: IDesiredJob | undefined;
  refetch: () => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface IApplicationFormItem extends FormItemProps {
  name: string;
  item?: ReactElement;
  listItem?: IFormListProps;
}

type IForm = Omit<IUpdateDesiredJobParams, 'id' | 'salaryExpectation'> & {
  salaryExpectation: string;
};

const { CloseOutlined, EnvironmentOutlined } = icons;

const ModalDesiredJob = ({
  data,
  isOpen,
  refetch,
  onCancel,
  setIsOpen,
  ...props
}: IProps) => {
  const [form] = useForm<IForm>();

  const { data: jobFields } = useFetch(
    ['allJobsFields'],
    JobsAPI.getAllJobFields
  );

  const { data: jobPositions } = useFetch(
    ['jobPositions'],
    JobsAPI.getAllJobPositions
  );

  const { data: placements } = useFetch(
    ['allPlacements'],
    JobsAPI.getAllPlacements
  );

  const { data: achievement } = useFetch(
    ['achievement'],
    UserAPI.getAchievementByUser
  );

  const { mutate: updateDesiredJob, isPending } = useMutation({
    mutationFn: (params: IUpdateDesiredJobParams) =>
      DesiredJobAPI.updateDesiredJob(params),
    onSuccess: (res) => {
      message.success(res?.message || 'Cập nhật công việc thành công');

      refetch();
      setIsOpen(false);
    },
    onError: (error: any) =>
      message.error(error?.response?.data?.message || 'Có lỗi xảy ra!'),
  });

  useEffect(() => {
    if (!data || !isOpen) return;

    const fieldsValue: IForm = {
      jobFieldsId: data.jobField.id,
      startAfterOffer: data.startAfterOffer,
      achivements: achievement?.result?.description || '',
      salaryExpectation: formatCurrencyVN(data.salarayExpectation),
      jobPlacementIds: data.desiredJobsPlacement.map(
        (jobPlacement) => jobPlacement.placementsId
      ),
      jobPositionIds: data.desiredJobsPosition.map(
        (jobPosition) => jobPosition.jobPositionsId
      ),
    };
    form.setFieldsValue(fieldsValue);
  }, [data, isOpen, achievement]);

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

  const formItems: IApplicationFormItem[] = useMemo(() => {
    return [
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
            message: 'Vui lòng chọn lĩnh vực bạn muốn ứng tuyển',
          },
        ],
      },
      {
        required: true,
        name: 'jobPositionIds',
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
        label: 'Nơi bạn mong muốn tìm việc? (Tối đa 3 địa điểm)',
        rules: [{ required: true, message: 'Vui lòng chọn địa điểm' }],
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
            prefixIcon={<EnvironmentOutlined />}
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
            placeholder="Ví dụ: 30,000,000"
            onChange={handleSalaryChange}
          />
        ),
        extra: 'Để trống nếu bạn muốn thương lượng sau.',
      },
      {
        name: 'startAfterOffer',
        label: 'Thời gian có thể bắt đầu làm việc kể từ khi nhận offer?',
        item: (
          <Select placeholder="Chọn thời gian" options={startTimeOptions} />
        ),
        rules: [
          {
            required: true,
            message: 'Vui lòng chọn thời gian bắt đầu làm việc',
          },
        ],
      },
      {
        name: 'achivements',
        label: 'Thành tích nổi bật',
        className: 'mb-0',
        extra: 'Mô tả ngắn gọn về thành tích nổi bật của bạn',
        item: (
          <TextArea
            className="p-3 !min-h-32 bg-light-gray"
            placeholder={`Ví dụ:\n- Tốt nghiệp loại giỏi chuyên ngành Quản trị Nhân lực với GPA 3.53/4.00\n- Đạt 100% KPI trong thời gian thử việc, vượt 119% KPI chung trong Quý 2.2022\n- Mang về mỗi tháng lên tới 30 khách hàng tương đương 40% doanh thu năm 2023`}
          />
        ),
        rules: [
          {
            required: true,
            message: 'Vui lòng mô tả thành tích nổi bật của bạn',
          },
        ],
      },
    ];
  }, [jobFields, jobPositions, placements, startTimeOptions]);

  const handleFinish = useCallback(
    (values: IForm) => {
      if (!data) {
        message.error('Không tìm thấy thông tin công việc');
        return;
      }

      const { salaryExpectation, ...others } = values;
      const numericSalary = Number(salaryExpectation.replace(/[^0-9]/g, ''));

      const params: IUpdateDesiredJobParams = {
        id: data.id,
        ...others,
        salaryExpectation: numericSalary,
      };
      updateDesiredJob(params);
    },
    [data]
  );

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      form.resetFields();
      onCancel && onCancel(e);
    },
    [form]
  );

  return (
    <Modal
      centered
      width={800}
      isOpen={isOpen}
      loading={isPending}
      title="Cập nhật công việc mong muốn"
      onCancel={handleCancel}
      onOk={() => form.submit()}
      {...props}
    >
      <FormWrapper form={form} onFinish={handleFinish}>
        {formItems.map((formItem) => {
          const { item, listItem, ...others } = formItem;

          if (item)
            return (
              <FormItem key={formItem.name} {...others}>
                {item}
              </FormItem>
            );
          else if (listItem)
            return (
              <FormList
                key={formItem.name}
                formItem={{ ...others }}
                {...listItem}
              />
            );
        })}
      </FormWrapper>
    </Modal>
  );
};

export default memo(ModalDesiredJob);
