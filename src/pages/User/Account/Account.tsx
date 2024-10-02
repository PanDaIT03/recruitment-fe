import { Divider, Typography } from 'antd';

import { IFormAccount } from '~/types/Account';
import FormAccount from './FormAccount';

const { Title } = Typography;

const Account = () => {
  const handleFinish = (values: IFormAccount) => {
    console.log(values);
  };

  return (
    <>
      <Title level={3}>Trang tài khoản</Title>
      <Divider className="mt-4" />
      <FormAccount onFinish={handleFinish} />
    </>
  );
};

export default Account;
