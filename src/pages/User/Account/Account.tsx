import { useMutation } from '@tanstack/react-query';
import { Divider, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';

import UserApi, { IUpdateAccountInfo } from '~/apis/user';
import { useMessage } from '~/contexts/MessageProvider';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getMe } from '~/store/thunk/auth';
import { IFormAccount } from '~/types/Account';
import FormAccount from './FormAccount';

const { Title } = Typography;

const Account = () => {
  const dispatch = useAppDispatch();
  const { messageApi } = useMessage();
  const [form] = useForm<IFormAccount>();

  const [isChangeName, setIsChangeName] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { mutate: updateAccountInfo, isPending } = useMutation({
    mutationFn: (params: IUpdateAccountInfo) =>
      UserApi.updateAccountInfo(params),
    onSuccess: (res) => {
      messageApi.success(res?.message || 'Cập nhật thông tin thành công');

      handleCancel();
      dispatch(getMe());
    },
    onError: (error: any) => {
      messageApi.error(
        `Cập nhật thông tin thất bại: ${error?.response?.data?.message}`
      );
    },
  });

  const handleSetFormDefault = () => {
    const formValues: IFormAccount = {
      password: undefined,
      reEnterPassword: undefined,
      email: currentUser.email,
      fullName: currentUser.fullName,
    };

    form.setFieldsValue(formValues);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsChangeName(false);
    setIsChangePassword(false);

    handleSetFormDefault();
  };

  const handleFinish = (values: IFormAccount) => {
    const params: IUpdateAccountInfo = {
      fullName: values?.fullName?.trim(),
      newPassword: values?.password?.trim(),
      isChangePassword: isChangePassword,
    };

    updateAccountInfo(params);
  };

  useEffect(() => {
    handleSetFormDefault();
  }, [currentUser]);

  return (
    <>
      <Title level={3}>Trang tài khoản</Title>
      <Divider className="mt-4" />
      <FormAccount
        form={form}
        loading={isPending}
        isChangeName={isChangeName}
        isChangePassword={isChangePassword}
        setIsChangeName={setIsChangeName}
        setIsChangePassword={setIsChangePassword}
        onFinish={handleFinish}
        onCancel={handleCancel}
      />
    </>
  );
};

export default Account;
