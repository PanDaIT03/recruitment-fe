import { useMutation } from '@tanstack/react-query';
import { Rate } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import { memo, useEffect, useState } from 'react';

import UserAPI, { ISkillParams } from '~/apis/user';
import FormItem from '~/components/Form/FormItem';
import Select from '~/components/Select/Select';
import { useMessage } from '~/contexts/MessageProvider';
import { useFetch } from '~/hooks/useFetch';
import { IUserSkill } from '~/types/User/profile';
import ProfileModal from './ProfileModal';

interface IProps {
  isOpen: boolean;
  data: IUserSkill;
  refetch: () => void;
  onCancel: () => void;
}

interface IForm {
  skill: number;
  level: number;
}

const SkillModal = ({ isOpen, data, refetch, onCancel }: IProps) => {
  const [form] = useForm<IForm>();
  const { messageApi } = useMessage();

  const [isEdit, setIsEdit] = useState(false);
  const [skillOptions, setSkillOptions] = useState<DefaultOptionType[]>([]);

  const { data: skillComboBox } = useFetch(['allSkills'], UserAPI.getAllSkill);

  const { mutate: createUserSkill, isPending: isCreatePending } = useMutation({
    mutationFn: (params: ISkillParams) => UserAPI.createUserSkill(params),
    onSuccess: (res) => {
      messageApi.success(res?.message);
      refetch();
    },
    onError: (error: any) =>
      messageApi.error(
        error?.response?.data?.message || 'Lỗi khi thêm kỹ năng'
      ),
  });

  const { mutate: updateUserSkill, isPending: isUpdatePending } = useMutation({
    mutationFn: (params: ISkillParams) => UserAPI.updateUserSkill(params),
    onSuccess: (res) => {
      messageApi.success(res?.message);
      refetch();
    },
    onError: (error: any) =>
      messageApi.error(
        error?.response?.data?.message || 'Lỗi khi cập nhật kỹ năng'
      ),
  });

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleFinish = (values: IForm) => {
    const params: ISkillParams = {
      skillsId: values.skill,
      level: values.level,
    };

    if (isEdit) updateUserSkill(params);
    else createUserSkill(params);

    handleCancel();
  };

  useEffect(() => {
    if (!data) {
      setIsEdit(false);
      return;
    }

    const fieldsValue = {
      skill: data.skill.id,
      level: data.level,
    };

    setIsEdit(true);
    form.setFieldsValue(fieldsValue);
  }, [data]);

  useEffect(() => {
    if (!skillComboBox) return;

    const options: DefaultOptionType[] = skillComboBox?.items.map((skill) => ({
      label: skill.title,
      value: skill.id,
    }));
    setSkillOptions(options);
  }, [skillComboBox]);

  return (
    <ProfileModal
      form={form}
      isOpen={isOpen}
      loading={isCreatePending || isUpdatePending}
      title="Thêm kỹ năng"
      onCancel={handleCancel}
      onFinish={handleFinish}
    >
      <FormItem
        name="skill"
        label="Kỹ năng"
        rules={[{ required: true, message: 'Hãy chọn kỹ năng của bạn' }]}
      >
        <Select
          disabled={isEdit}
          options={skillOptions}
          placeholder="Ví dụ: Microsoft Excel..."
        />
      </FormItem>
      <FormItem
        name="level"
        label="Thành thạo"
        rules={[
          { required: true, message: 'Hãy chọn mức độ thành thạo của bạn' },
        ]}
      >
        <Rate />
      </FormItem>
    </ProfileModal>
  );
};

export default memo(SkillModal);
