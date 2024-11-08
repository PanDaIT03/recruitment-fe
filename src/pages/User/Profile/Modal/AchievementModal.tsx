import { useMutation } from '@tanstack/react-query';
import { useForm } from 'antd/es/form/Form';
import { memo, useEffect, useState } from 'react';

import UserApi, { IAchievementParams } from '~/apis/user';
import Editor from '~/components/Editor/Editor';
import FormItem from '~/components/Form/FormItem';
import { useMessage } from '~/contexts/MessageProvider';
import { IAchievement } from '~/types/User/profile';
import ProfileModal from './ProfileModal';

interface IProps {
  isOpen: boolean;
  data: IAchievement;
  refetch: () => void;
  onCancel: () => void;
}

const AchievementModal = ({ data, isOpen, refetch, onCancel }: IProps) => {
  const [form] = useForm();
  const { messageApi } = useMessage();

  const [isEdit, setIsEdit] = useState(false);

  const { mutate: createAchievement, isPending: isCreateAchievementPending } =
    useMutation({
      mutationFn: (params: IAchievementParams) =>
        UserApi.createAchievement(params),
      onSuccess: () => {
        messageApi.success('Tạo thành tựu thành công');
        refetch();
      },
      onError: (error: any) =>
        messageApi.error(
          error?.response?.data?.message || 'Lỗi khi tạo thành tựu'
        ),
    });

  const { mutate: updateAchievement, isPending: isUpdateAchievementPending } =
    useMutation({
      mutationFn: (params: IAchievement) => UserApi.updateAchievement(params),
      onSuccess: () => {
        messageApi.success('Cập nhật thành tựu thành công');
        refetch();
      },
      onError: (error: any) =>
        messageApi.error(
          error?.response?.data?.message || 'Lỗi khi cập nhật thành tựu'
        ),
    });

  useEffect(() => {
    if (!data) {
      setIsEdit(false);
      return;
    }

    setIsEdit(true);
    isOpen && form.setFieldValue('achievement', data);
  }, [data, isOpen]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleFinish = async (values: any) => {
    const { achievement } = values;

    isEdit
      ? updateAchievement({
          id: data.id,
          description: achievement?.level?.content,
        })
      : createAchievement({
          description: achievement?.level?.content,
        });

    handleCancel();
  };

  return (
    <ProfileModal
      form={form}
      isOpen={isOpen}
      loading={isCreateAchievementPending || isUpdateAchievementPending}
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
        <Editor
          initialValue={data.description}
          onChange={(val) => console.log(val)}
        />
      </FormItem>
    </ProfileModal>
  );
};

export default memo(AchievementModal);
