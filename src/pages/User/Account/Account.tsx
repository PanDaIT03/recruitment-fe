import { Divider, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';

import { useAppSelector } from '~/hooks/useStore';
import { IFormAccount } from '~/types/Account';
import FormAccount from './FormAccount';

const { Title } = Typography;
const defaultPassword = '12345678';

const Account = () => {
  const [form] = useForm<IFormAccount>();

  const { currentUser } = useAppSelector((state) => state.auth);

  const handleSetFormDefault = () => {
    const formValues: IFormAccount = {
      email: currentUser.email,
      password: defaultPassword,
      fullName: currentUser.fullName,
    };

    form.setFieldsValue(formValues);
  };

  useEffect(() => {
    handleSetFormDefault();
  }, [currentUser]);

  const handleCancel = () => {
    form.resetFields();
    handleSetFormDefault();
  };

  const handleFinish = (values: IFormAccount) => {
    console.log(values);
  };

  return (
    <>
      <Title level={3}>Trang tài khoản</Title>
      <Divider className="mt-4" />
      <FormAccount
        form={form}
        onCancel={handleCancel}
        onFinish={handleFinish}
      />
    </>
  );
};

export default Account;
