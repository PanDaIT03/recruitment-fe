import { useForm } from 'antd/es/form/Form';
import { memo } from 'react';

import FormItem from '~/components/Form/FormItem';
import ProfileModal from './ProfileModal';
import Input from '~/components/Input/Input';
import { Rate } from 'antd';
import { Box } from '~/assets/svg';

interface IProps {
  isOpen: boolean;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

const SkillModal = ({ isOpen, setSelectedItem }: IProps) => {
  const [form] = useForm();

  const handleFinish = (values: any) => {
    console.log(values);
  };

  const handleCancel = () => {
    setSelectedItem('');
  };

  return (
    <ProfileModal
      form={form}
      isOpen={isOpen}
      title="Thêm kỹ năng"
      onCancel={handleCancel}
      onFinish={handleFinish}
    >
      <FormItem
        name="skill"
        label="Kỹ năng"
        rules={[{ required: true, message: 'Hãy chọn kỹ năng của bạn' }]}
      >
        <Input
          name="skill"
          prefix={<Box width={16} height={16} />}
          placeholder="Ví dụ: Microsoft Excel..."
        />
      </FormItem>
      <FormItem
        name="level"
        label="Thành thạo"
        rules={[{ required: true, message: 'Hãy mức độ thành thạo của bạn' }]}
      >
        <Rate allowHalf />
      </FormItem>
    </ProfileModal>
  );
};

export default memo(SkillModal);
