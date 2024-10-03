import { Checkbox } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { DefaultOptionType } from 'antd/es/select';
import { memo, useEffect, useState } from 'react';

import { JobsAPI } from '~/apis/job';
import { DatePicker, RangePicker } from '~/components/DatePicker/DatePicker';
import FormItem from '~/components/Form/FormItem';
import Input from '~/components/Input/Input';
import CustomSelect from '~/components/Select/CustomSelect';
import Select from '~/components/Select/Select';
import { useFetch } from '~/hooks/useFetch';
import { JobPlacement } from '~/types/Job';
import icons from '~/utils/icons';
import ProfileModal from './ProfileModal';
import { Location } from '~/assets/svg';

interface IProps {
  isOpen: boolean;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

const { BankOutlined, IdcardOutlined, ContainerOutlined } = icons;

const workTypeOptions: DefaultOptionType[] = [
  { label: 'Toàn thời gian', value: 'full-time' },
  { label: 'Bán thời gian', value: 'part-time' },
  { label: 'Làm tự do', value: 'freelance' },
  { label: 'Thời vụ', value: 'seasonal' },
];

const ExperienceModal = ({ isOpen, setSelectedItem }: IProps) => {
  const [form] = useForm();

  const [isChecked, setIsChecked] = useState(true);
  const { data: placements } = useFetch<JobPlacement>(JobsAPI.getAllPlacements);

  const handleFinish = (values: any) => {
    console.log(values);
  };

  const handleCancel = () => {
    setSelectedItem('');
  };

  useEffect(() => {
    form.setFieldValue('workType', 'full-time');
  }, []);

  return (
    <ProfileModal
      form={form}
      isOpen={isOpen}
      title="Thêm kinh nghiệm làm việc"
      onCancel={handleCancel}
      onFinish={handleFinish}
    >
      <FormItem
        name="company"
        label="Công ty"
        rules={[{ required: true, message: 'Hãy nhập công ty của bạn' }]}
      >
        <Input
          name="company"
          prefix={<BankOutlined />}
          placeholder="Ví dụ: Google, Facebook, Apple..."
        />
      </FormItem>
      <FormItem
        name="title"
        label="Chức danh"
        rules={[{ required: true, message: 'Hãy nhập chức danh của bạn' }]}
      >
        <Input
          name="title"
          prefix={<IdcardOutlined />}
          placeholder="Ví dụ: Trường phòng nhân sự"
        />
      </FormItem>
      <FormItem
        name="workType"
        label="Loại hình làm việc"
        rules={[
          { required: true, message: 'Hãy chọn loại hình làm việc của bạn' },
        ]}
      >
        <Select
          allowClear
          options={workTypeOptions}
          placeholder="Chọn loại hình làm việc"
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
        name="startWork"
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
            picker="month"
            format="MM/YYYY"
            inputReadOnly={true}
            isCalendarIconPrefix={true}
            placeholder={['Chọn thời gian bắt đầu', 'Chọn thời gian kết thúc']}
          />
        ) : (
          <DatePicker
            allowClear
            picker="month"
            format="MM/YYYY"
            inputReadOnly={true}
            isCalendarIconPrefix={true}
            placeholder="Chọn thời gian bắt đầu"
          />
        )}
      </FormItem>
      <FormItem
        name="workplace"
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
        name="summary"
        label="Tóm tắt"
        className="mb-1"
        rules={[{ required: true, message: 'Hãy nơi làm việc của bạn' }]}
      >
        <TextArea
          placeholder="Ví dụ: Quản lý nhân sự, tuyển dụng, đào tạo, chấm công, xử lý kỷ luật"
          className="p-3 rounded-lg !min-h-20"
        />
      </FormItem>
      <p className="text-sm text-sub font-medium">
        Tóm tắt về trách nghiệm, thành tựu bạn đã đạt được trong công việc này
      </p>
    </ProfileModal>
  );
};

export default memo(ExperienceModal);
