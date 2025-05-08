import { useMutation } from '@tanstack/react-query';
import { Checkbox } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { memo, useEffect, useState } from 'react';

import { JobsAPI } from '~/apis/job';
import UserAPI, { IUpdateWorkExperience } from '~/apis/user';
import { DatePicker, RangePicker } from '~/components/DatePicker/DatePicker';
import FormItem from '~/components/Form/FormItem';
import Input from '~/components/Input/Input';
import Select from '~/components/Select/Select';
import { useMessage } from '~/contexts/MessageProvider';
import { useFetch } from '~/hooks/useFetch';
import {
  IUserProfileData,
  IUserProfileForm,
  IWorkExperience,
} from '~/types/User/profile';
import icons from '~/utils/icons';
import ProfileModal from './ProfileModal';

interface IProps {
  isOpen: boolean;
  data: IWorkExperience;
  onCancel: () => void;
  refetch: () => void;
}

const { BankOutlined } = icons;

const ExperienceModal = ({ data, isOpen, refetch, onCancel }: IProps) => {
  const { messageApi } = useMessage();
  const [form] = useForm<IUserProfileForm>();

  const [isEdit, setIsEdit] = useState(false);
  const [isChecked, setIsChecked] = useState(true);

  const { data: placements } = useFetch(
    ['placements'],
    JobsAPI.getAllPlacements
  );

  const { data: jobPositions } = useFetch(
    ['jobPositions'],
    JobsAPI.getAllJobPositions
  );

  const { data: jobCategories } = useFetch(
    ['jobCategories'],
    JobsAPI.getAllJobCategories
  );

  const { mutate: createWorkExperience, isPending: isCreateWorkPending } =
    useMutation({
      mutationFn: (params: IUserProfileData) =>
        UserAPI.createWorkExperience(params),
      onSuccess: (res) => {
        messageApi.success(res?.message);

        refetch();
        handleCancel();
      },
      onError: (error: any) =>
        messageApi.error(
          error?.response?.data?.message || 'Lỗi khi thêm kinh nghiệm làm việc'
        ),
    });

  const { mutate: updateWorkExperience, isPending: isUpdateWorkPending } =
    useMutation({
      mutationFn: (params: IUpdateWorkExperience) =>
        UserAPI.updateWorkExperience(params),
      onSuccess: (res) => {
        messageApi.success(res?.message);

        refetch();
        handleCancel();
      },
      onError: (error: any) =>
        messageApi.error(
          error?.response?.data?.message ||
            'Lỗi khi cập nhật kinh nghiệm làm việc'
        ),
    });

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleFinish = async (values: IUserProfileForm) => {
    const { workingTime, ...others } = values;
    let startDate = null,
      endDate = null;

    Array.isArray(workingTime)
      ? ((startDate = dayjs(workingTime[0]).format('YYYY/MM/DD HH:mm:ss')),
        (endDate = dayjs(workingTime[1]).format('YYYY/MM/DD HH:mm:ss')))
      : (startDate = dayjs(workingTime).format('YYYY/MM/DD HH:mm:ss'));

    const params: IUserProfileData = {
      ...others,
      startDate: startDate,
      endDate: endDate,
      companyName: values?.companyName?.trim(),
      description: values?.description?.trim(),
    };

    isEdit
      ? updateWorkExperience({ id: data.id, ...params })
      : createWorkExperience(params);
  };

  useEffect(() => {
    if (!data) {
      setIsEdit(false);
      return;
    }

    const workingTime = data.endDate
      ? [dayjs(data.startDate), dayjs(data.endDate)]
      : dayjs(data.startDate);

    const fieldsValue: IUserProfileForm = {
      companyName: data.companyName,
      positionId: data.jobPosition.id,
      jobCategoriesId: data.jobCategory.id,
      workingTime: workingTime,
      placementsId: data.placement.id,
      description: data.description,
    };

    setIsEdit(true);
    form.setFieldsValue(fieldsValue);
  }, [data]);

  return (
    <ProfileModal
      form={form}
      isOpen={isOpen}
      loading={isCreateWorkPending || isUpdateWorkPending}
      title="Thêm kinh nghiệm làm việc"
      onCancel={handleCancel}
      onFinish={handleFinish}
    >
      <FormItem
        name="companyName"
        label="Công ty"
        rules={[{ required: true, message: 'Hãy nhập công ty của bạn' }]}
      >
        <Input
          name="companyName"
          prefix={<BankOutlined />}
          placeholder="Ví dụ: Google, Facebook, Apple..."
        />
      </FormItem>
      <FormItem
        name="positionId"
        label="Chức danh"
        rules={[{ required: true, message: 'Hãy nhập chức danh của bạn' }]}
      >
        <Select
          allowClear
          placeholder="Chọn chức danh"
          options={jobPositions?.items.map((jobPosition) => ({
            value: jobPosition.id,
            label: jobPosition.title,
          }))}
        />
      </FormItem>
      <FormItem
        name="jobCategoriesId"
        label="Loại hình làm việc"
        rules={[
          { required: true, message: 'Hãy chọn loại hình làm việc của bạn' },
        ]}
      >
        <Select
          allowClear
          placeholder="Chọn loại hình làm việc"
          options={jobCategories?.items.map((jobCategory) => ({
            value: jobCategory.id,
            label: jobCategory.name,
          }))}
        />
      </FormItem>
      <Checkbox
        checked={isChecked}
        className="mb-3 select-none"
        onClick={() => setIsChecked(!isChecked)}
      >
        Hiện đang làm việc ở đây
      </Checkbox>
      <FormItem
        name="workingTime"
        label="Thời gian làm việc"
        rules={[
          {
            required: true,
            message: 'Hãy chọn thời gian làm việc của bạn',
          },
        ]}
      >
        {isChecked ? (
          <DatePicker
            allowClear
            format="DD/MM/YYYY"
            inputReadOnly={true}
            isCalendarIconPrefix={true}
            placeholder="Chọn thời gian bắt đầu"
          />
        ) : (
          <RangePicker
            allowClear
            format="DD/MM/YYYY"
            inputReadOnly={true}
            isCalendarIconPrefix={true}
            placeholder={['Chọn thời gian bắt đầu', 'Chọn thời gian kết thúc']}
          />
        )}
      </FormItem>
      <FormItem
        name="placementsId"
        label="Nơi làm việc"
        rules={[{ required: true, message: 'Hãy nơi làm việc của bạn' }]}
      >
        <Select
          allowClear
          placeholder="Địa điểm"
          options={placements?.items?.map((place) => ({
            value: place?.id,
            label: place?.title,
          }))}
        />
      </FormItem>
      <FormItem
        name="description"
        label="Tóm tắt"
        className="mb-1"
        rules={[{ required: true, message: 'Hãy nơi làm việc của bạn' }]}
      >
        <TextArea
          name="description"
          className="p-3 rounded-lg !min-h-20 bg-light-gray"
          placeholder="Ví dụ: Quản lý nhân sự, tuyển dụng, đào tạo, chấm công, xử lý kỷ luật"
        />
      </FormItem>
      <p className="text-sm text-sub font-medium">
        Tóm tắt về trách nghiệm, thành tựu bạn đã đạt được trong công việc này
      </p>
    </ProfileModal>
  );
};

export default memo(ExperienceModal);
