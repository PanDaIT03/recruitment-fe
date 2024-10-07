import { useForm } from 'antd/es/form/Form';
import { memo, useEffect, useState } from 'react';

import UserApi from '~/apis/user';
import Editor from '~/components/Editor/Editor';
import FormItem from '~/components/Form/FormItem';
import toast from '~/utils/functions/toast';
import ProfileModal from './ProfileModal';

interface IProps {
  data: string;
  isOpen: boolean;
  refetch: () => void;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

const AchievementModal = ({
  data,
  isOpen,
  refetch,
  setSelectedItem,
}: IProps) => {
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async (values: any) => {
    setIsLoading(true);

    const { achievement } = values;
    const { message, statusCode } = await UserApi.createAchievement({
      description: achievement?.level?.content,
    });

    if (statusCode === 200) refetch();
    toast[statusCode === 200 ? 'success' : 'error'](message || 'Có lỗi xảy ra');

    setIsLoading(false);
    setSelectedItem('');
    form.resetFields();
  };

  const handleCancel = () => {
    setSelectedItem('');
  };

  useEffect(() => {
    form.setFieldValue('achievement', data);
  }, []);

  return (
    <ProfileModal
      form={form}
      isOpen={isOpen}
      loading={isLoading}
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
        <Editor initialValue={data} />
      </FormItem>
    </ProfileModal>
  );
};

export default memo(AchievementModal);
