import dayjs, { Dayjs } from 'dayjs';
import { Checkbox } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { memo, useState } from 'react';

import { JobsAPI } from '~/apis/job';
import { DatePicker, RangePicker } from '~/components/DatePicker/DatePicker';
import FormItem from '~/components/Form/FormItem';
import Input from '~/components/Input/Input';
import Select from '~/components/Select/Select';
import { useFetch } from '~/hooks/useFetch';
import { JobPlacement, PaginatedJobCategories } from '~/types/Job';
import { IUserProfile, IUserProfileForm } from '~/types/User/UserProfile';
import icons from '~/utils/icons';
import ProfileModal from './ProfileModal';

interface IProps {
  isOpen: boolean;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

const { BankOutlined, IdcardOutlined } = icons;

const ExperienceModal = ({ isOpen, setSelectedItem }: IProps) => {
  const [form] = useForm<IUserProfileForm>();

  const [isChecked, setIsChecked] = useState(true);

  const { data: placements } = useFetch<JobPlacement>(JobsAPI.getAllPlacements);
  const { data: jobCategories } = useFetch<PaginatedJobCategories>(
    JobsAPI.getAllJobCategories
  );

  const handleFinish = (values: IUserProfileForm) => {
    const { workingTime, ...rest } = values;
    let startDate = null,
      endDate = null;

    Array.isArray(workingTime)
      ? ((startDate = dayjs(workingTime[0]).format('YYYY/MM/DD HH:mm:ss')),
        (endDate = dayjs(workingTime[1]).format('YYYY/MM/DD HH:mm:ss')))
      : (startDate = dayjs(workingTime).format('YYYY/MM/DD HH:mm:ss'));

    const params: IUserProfile = {
      ...rest,
      startDate: startDate,
      endDate: endDate,
    };

    console.log('params', params);
  };

  const handleCancel = () => {
    setSelectedItem('');
  };

  return (
    <ProfileModal
      form={form}
      isOpen={isOpen}
      title="Thêm kinh nghiệm làm việc"
      onCancel={handleCancel}
      onFinish={handleFinish}
    >
      <FormItem
        name="companyName"
        label="Công ty"
        // rules={[{ required: true, message: 'Hãy nhập công ty của bạn' }]}
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
        // rules={[{ required: true, message: 'Hãy nhập chức danh của bạn' }]}
      >
        <Input
          name="positionId"
          prefix={<IdcardOutlined />}
          placeholder="Ví dụ: Trường phòng nhân sự"
        />
      </FormItem>
      <FormItem
        name="jobCategoriesId"
        label="Loại hình làm việc"
        // rules={[
        //   { required: true, message: 'Hãy chọn loại hình làm việc của bạn' },
        // ]}
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
          <RangePicker
            allowClear
            format="DD/MM/YYYY"
            inputReadOnly={true}
            isCalendarIconPrefix={true}
            placeholder={['Chọn thời gian bắt đầu', 'Chọn thời gian kết thúc']}
          />
        ) : (
          <DatePicker
            allowClear
            format="DD/MM/YYYY"
            inputReadOnly={true}
            isCalendarIconPrefix={true}
            placeholder="Chọn thời gian bắt đầu"
          />
        )}
      </FormItem>
      <FormItem
        name="placementsId"
        label="Nơi làm việc"
        // rules={[{ required: true, message: 'Hãy nơi làm việc của bạn' }]}
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
        // rules={[{ required: true, message: 'Hãy nơi làm việc của bạn' }]}
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
