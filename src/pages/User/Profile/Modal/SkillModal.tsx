import { Rate } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import { memo, useEffect, useState } from 'react';

import UserApi, { ISkillParams } from '~/apis/user';
import FormItem from '~/components/Form/FormItem';
import Select from '~/components/Select/Select';
import { useFetch } from '~/hooks/useFetch';
import useMessageApi from '~/hooks/useMessageApi';
import { UserSkill } from '~/types/User';
import ProfileModal from './ProfileModal';

interface IProps {
  isOpen: boolean;
  data: UserSkill;
  refetch: () => void;
  onCancel: () => void;
}

const SkillModal = ({ isOpen, data, refetch, onCancel }: IProps) => {
  const [form] = useForm();

  const [skillOptions, setSkillOptions] = useState<DefaultOptionType[]>([]);

  const { data: skillComboBox } = useFetch(UserApi.getAllSkill);
  const { mutate: createUserSkill } = useMessageApi({
    apiFn: (params: ISkillParams) => UserApi.createUserSkill(params),
    onSuccess: () => {
      refetch();
    },
  });

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleFinish = (values: any) => {
    const params: ISkillParams = {
      skillsId: values.skill,
      level: values.level,
    };

    createUserSkill(params);
    handleCancel();
  };

  useEffect(() => {
    if (!Object.keys(data).length) return;

    const fieldsValue = {
      skill: data.skill.title,
      level: data.level.toString(),
    };
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
          options={skillOptions}
          placeholder="Ví dụ: Microsoft Excel..."
        />
      </FormItem>
      <FormItem
        name="level"
        label="Thành thạo"
        rules={[{ required: true, message: 'Hãy mức độ thành thạo của bạn' }]}
      >
        <Rate />
      </FormItem>
    </ProfileModal>
  );
};

export default memo(SkillModal);
