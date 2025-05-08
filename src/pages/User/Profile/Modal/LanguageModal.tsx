import { useMutation } from '@tanstack/react-query';
import { Flex, Image } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import { useEffect, useState } from 'react';

import UserAPI, { ILanguageParams } from '~/apis/user';
import FormItem from '~/components/Form/FormItem';
import Select from '~/components/Select/Select';
import { useMessage } from '~/contexts/MessageProvider';
import { useFetch } from '~/hooks/useFetch';
import { IForeignLanguage } from '~/types/User/profile';
import ProfileModal from './ProfileModal';

interface IProps {
  isOpen: boolean;
  data: IForeignLanguage;
  refetch: () => void;
  onCancel: () => void;
}

export const advanceOptions: DefaultOptionType[] = [
  { label: 'Sơ cấp', value: '1' },
  { label: 'Giao tiếp cơ bản', value: '2' },
  { label: 'Giao tiếp chuyên nghiệp', value: '3' },
  { label: 'Hoàn toàn thành thạo', value: '4' },
];

const LanguageModal = ({ isOpen, data, refetch, onCancel }: IProps) => {
  const [form] = useForm();
  const { messageApi } = useMessage();

  const [isEdit, setIsEdit] = useState(false);
  const [languageOptions, setLanguageOptions] = useState<DefaultOptionType[]>(
    []
  );

  const { data: languages } = useFetch(
    ['foreignLanguage'],
    UserAPI.getAllForeignLanguage
  );

  const { mutate: createUserLanguage, isPending: isCreatePending } =
    useMutation({
      mutationFn: (params: ILanguageParams) =>
        UserAPI.createForeignLanguage(params),
      onSuccess: (res) => {
        messageApi.success(res?.message);

        refetch();
        handleCancel();
      },
      onError: (error: any) =>
        messageApi.error(
          error?.response?.data?.message || 'Lỗi khi thêm ngoại ngữ'
        ),
    });

  const { mutate: updateUserLanguage, isPending: isUpdatePending } =
    useMutation({
      mutationFn: (params: ILanguageParams) =>
        UserAPI.updateForeignLanguage(params),
      onSuccess: (res) => {
        messageApi.success(res?.message);

        refetch();
        handleCancel();
      },
      onError: (error: any) =>
        messageApi.error(
          error?.response?.data?.message || 'Lỗi khi cập nhật ngoại ngữ'
        ),
    });

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleFinish = (values: any) => {
    const params: ILanguageParams = {
      foreignLanguagesId: values.language,
      level: Number(values.advanced),
    };

    isEdit ? updateUserLanguage(params) : createUserLanguage(params);
  };

  useEffect(() => {
    if (!isOpen) return;
    !data && form.setFieldValue('advanced', '2');
  }, [isOpen]);

  useEffect(() => {
    if (!data) {
      setIsEdit(false);
      return;
    }

    const fieldsValue = {
      language: data.foreignLanguagesId,
      advanced: data.level?.toString(),
    };

    setIsEdit(true);
    form.setFieldsValue(fieldsValue);
  }, [data]);

  useEffect(() => {
    if (!languages) return;

    const options: DefaultOptionType[] = languages?.items.map((language) => ({
      label: (
        <Flex align="center" gap={16}>
          <Image
            width={16}
            height={16}
            preview={false}
            src={language?.imageUrl}
          />
          <span>{language?.title}</span>
        </Flex>
      ),
      value: language.id,
    }));

    setLanguageOptions(options);
  }, [languages]);

  return (
    <ProfileModal
      form={form}
      isOpen={isOpen}
      loading={isCreatePending || isUpdatePending}
      title={isEdit ? 'Cập nhật ngoại ngữ' : 'Thêm ngoại ngữ'}
      onCancel={handleCancel}
      onFinish={handleFinish}
    >
      <FormItem
        name="language"
        label="Ngoại ngữ"
        rules={[{ required: true, message: 'Hãy chọn ngoại ngữ của bạn' }]}
      >
        <Select
          allowClear
          disabled={isEdit}
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
