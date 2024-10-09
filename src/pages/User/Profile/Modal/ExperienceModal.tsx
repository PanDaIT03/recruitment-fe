import { Checkbox } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { memo, useEffect, useState } from 'react';

import { JobsAPI } from '~/apis/job';
import UserApi from '~/apis/user';
import { DatePicker, RangePicker } from '~/components/DatePicker/DatePicker';
import FormItem from '~/components/Form/FormItem';
import Input from '~/components/Input/Input';
import Select from '~/components/Select/Select';
import { useFetch } from '~/hooks/useFetch';
import {
  JobPlacement,
  PaginatedJobCategories,
  PaginatedJobPositions,
} from '~/types/Job';
import {
  IUserProfileData,
  IUserProfileForm,
  IWorkExperience,
} from '~/types/User';
import toast from '~/utils/functions/toast';
import icons from '~/utils/icons';
import ProfileModal from './ProfileModal';

interface IProps {
  isOpen: boolean;
  data: IWorkExperience;
  refetch: () => void;
  onCancel: () => void;
}

const { BankOutlined } = icons;

const ExperienceModal = ({ data, isOpen, refetch, onCancel }: IProps) => {
  const [form] = useForm<IUserProfileForm>();

  const [isEdit, setIsEdit] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { data: placements } = useFetch<JobPlacement>(JobsAPI.getAllPlacements);
  const { data: jobPositions } = useFetch<PaginatedJobPositions>(
    JobsAPI.getAllJobPositions
  );
  const { data: jobCategories } = useFetch<PaginatedJobCategories>(
    JobsAPI.getAllJobCategories
  );

  const handleFinish = async (values: IUserProfileForm) => {
    setIsLoading(true);

    const { workingTime, ...rest } = values;
    let startDate = null,
      endDate = null;

    Array.isArray(workingTime)
      ? ((startDate = dayjs(workingTime[0]).format('YYYY/MM/DD HH:mm:ss')),
        (endDate = dayjs(workingTime[1]).format('YYYY/MM/DD HH:mm:ss')))
      : (startDate = dayjs(workingTime).format('YYYY/MM/DD HH:mm:ss'));

    const params: IUserProfileData = {
      ...rest,
      startDate: startDate,
      endDate: endDate,
    };

    const { statusCode, message } = isEdit
      ? await UserApi.updateWorkExperience({ id: data.id, ...params })
      : await UserApi.createWorkExperience(params);

    if (statusCode === 200) refetch();
    toast[statusCode === 200 ? 'success' : 'error'](message || 'Có lỗi xảy ra');

    setIsLoading(false);
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    if (Object.keys(data).length) {
      setIsEdit(true);

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

      form.setFieldsValue(fieldsValue);
    } else setIsEdit(false);
  }, [data]);

  return (
    <ProfileModal
      form={form}
      isOpen={isOpen}
      loading={isLoading}
      title="Thêm kinh nghiệm làm việc"
      onCancel={onCancel}
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
          className="p-3 rounded-lg !min-h-20"
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
