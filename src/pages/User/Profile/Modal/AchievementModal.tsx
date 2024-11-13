import { useMutation } from '@tanstack/react-query';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { memo, useEffect, useState } from 'react';

import UserApi, { IAchievementParams } from '~/apis/user';
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
      onSuccess: (res) => {
        messageApi.success(res?.message);
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
      onSuccess: (res) => {
        messageApi.success(res?.message);
        refetch();
      },
      onError: (error: any) =>
        messageApi.error(
          error?.response?.data?.message || 'Lỗi khi cập nhật thành tựu'
        ),
    });

  const { mutate: deleteAchievement, isPending: isDelAchievementPending } =
    useMutation({
      mutationFn: (id: number) => UserApi.deleteAchievement(id),
      onSuccess: (res) => {
        messageApi.success(res?.message);
        refetch();
      },
      onError: (error: any) =>
        messageApi.error(
          error?.response?.data?.message || 'Lỗi khi xoá thành tựu'
        ),
    });

  useEffect(() => {
    if (!data || !Object.keys(data).length) {
      setIsEdit(false);
      return;
    }

    setIsEdit(true);

    isOpen && form.setFieldValue('achievement', data.description);
  }, [data, isOpen]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleFinish = async (values: any) => {
    const { achievement } = values;

    if (!isEdit)
      createAchievement({
        description: achievement,
      });
    else
      !achievement
        ? deleteAchievement(data.id)
        : updateAchievement({
            id: data.id,
            description: achievement,
          });

    handleCancel();
  };

  return (
    <ProfileModal
      form={form}
      isOpen={isOpen}
      loading={
        isCreateAchievementPending ||
        isUpdateAchievementPending ||
        isDelAchievementPending
      }
      title="Cập nhật tóm tắt"
      onCancel={handleCancel}
      onFinish={handleFinish}
    >
      <FormItem
        name="achievement"
        label={
          <p className="text-sm font-medium">
            Tóm tắt 3-5 thành tựu hoặc lý do nổi bật khiến nhà tuyển dụng chọn
            bạn?
          </p>
        }
      >
        <TextArea
          placeholder={`Ví dụ:\n- Tốt nghiệp loại giỏi chuyên ngành Quản trị Nhân lực với GPA 3.53/4.00\n- Đạt 100% KPI trong thời gian thử việc, vượt 119% KPI chung trong Quý 2.2022\n- Mang về mỗi tháng lên tới 30 khách hàng tương đương 40% doanh thu năm 2023`}
          className="p-3 !min-h-44 bg-light-gray"
        />
      </FormItem>
    </ProfileModal>
  );
};

export default memo(AchievementModal);
