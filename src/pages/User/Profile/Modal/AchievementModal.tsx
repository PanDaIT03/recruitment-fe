import { useForm } from 'antd/es/form/Form';
import { memo } from 'react';

import FormItem from '~/components/Form/FormItem';
import ProfileModal from './ProfileModal';
import Editor from '~/components/Editor/Editor';

interface IProps {
  isOpen: boolean;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

const AchievementModal = ({ isOpen, setSelectedItem }: IProps) => {
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
      title="Cập nhật tóm tắt"
      onCancel={handleCancel}
      onFinish={handleFinish}
    >
      <FormItem
        name="achievement"
        rules={[{ required: true, message: 'Hãy điền vào tóm tắt của bạn' }]}
        label={
          <p className="text-sm font-medium">
            Tóm tắt 3-5 thành tựu hoặc lý do nổi bật khiến nhà tuyển dụng chọn
            bạn?
          </p>
        }
      >
        <Editor />
      </FormItem>
    </ProfileModal>
  );
};

export default memo(AchievementModal);
