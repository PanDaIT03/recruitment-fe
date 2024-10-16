import { useForm } from 'antd/es/form/Form';
import { memo, useEffect } from 'react';

import UserApi, { IAchievementParams } from '~/apis/user';
import Editor from '~/components/Editor/Editor';
import FormItem from '~/components/Form/FormItem';
import useMessageApi from '~/hooks/useMessageApi';
import ProfileModal from './ProfileModal';

interface IProps {
  data: string;
  isOpen: boolean;
  refetch: () => void;
  onCancel: () => void;
}

const AchievementModal = ({ data, isOpen, refetch, onCancel }: IProps) => {
  const [form] = useForm();

  const { mutate: createAchievement, isPending } = useMessageApi({
    apiFn: (params: IAchievementParams) => UserApi.createAchievement(params),
    onSuccess: () => refetch(),
  });

  useEffect(() => {
    console.log(data);

    if (!isOpen) return;
    form.setFieldValue('achievement', data);

    console.log(form.getFieldsValue());
  }, [isOpen]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleFinish = async (values: any) => {
    const { achievement } = values;
    createAchievement({
      description: achievement?.level?.content,
    });
    handleCancel();
  };

  return (
    <ProfileModal
      form={form}
      isOpen={isOpen}
      loading={isPending}
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
        <Editor initialValue={data} onChange={(val) => console.log(val)} />
      </FormItem>
    </ProfileModal>
  );
};

export default memo(AchievementModal);
