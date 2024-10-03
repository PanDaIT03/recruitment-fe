import { useForm } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';

import FormItem from '~/components/Form/FormItem';
import Select from '~/components/Select/Select';
import ProfileModal from './ProfileModal';
import { useEffect } from 'react';

interface IProps {
  isOpen: boolean;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

const languageOptions: DefaultOptionType[] = [
  {
    label: 'English',
    value: 'eng',
  },
  {
    label: 'Japanse',
    value: 'jp',
  },
  {
    label: 'Korean',
    value: 'korean',
  },
  {
    label: 'Chinese',
    value: 'chinese',
  },
  {
    label: 'French',
    value: 'french',
  },
  {
    label: 'German',
    value: 'german',
  },
];

const advanceOptions: DefaultOptionType[] = [
  { label: 'Sơ cấp', value: 'elementary' },
  { label: 'Giao tiếp cơ bản', value: 'intermediate' },
  { label: 'Giao tiếp chuyên nghiệp', value: 'advanced' },
  { label: 'Hoàn toàn thành thạo', value: 'proficient' },
];

const LanguageModal = ({ isOpen, setSelectedItem }: IProps) => {
  const [form] = useForm();

  const handleFinish = (values: any) => {
    console.log(values);
  };

  const handleCancel = () => {
    setSelectedItem('');
  };

  useEffect(() => {
    form.setFieldValue('advanced', 'intermediate');
  }, []);

  return (
    <ProfileModal
      form={form}
      isOpen={isOpen}
      title="Cập nhật tóm tắt"
      onCancel={handleCancel}
      onFinish={handleFinish}
    >
      <FormItem
        name="achievement"
        label="Ngoại ngữ"
        rules={[{ required: true, message: 'Hãy chọn ngoại ngữ của bạn' }]}
      >
        <Select
          allowClear
          options={languageOptions}
          placeholder="Chọn loại ngoại ngữ"
        />
      </FormItem>
      <FormItem
        name="advanced"
        label="Trình độ"
        rules={[{ required: true, message: 'Hãy trình độ của bạn' }]}
      >
        <Select
          allowClear
          options={advanceOptions}
          placeholder="Chọn trình độ"
        />
      </FormItem>
    </ProfileModal>
  );
};

export default LanguageModal;
