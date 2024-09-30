import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useNavigate } from 'react-router-dom';

import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import { emailRegex } from '~/utils/constant';
import PATH from '~/utils/path';

const ForgotPassword = () => {
  const [form] = useForm();
  const navigate = useNavigate();

  const handleFinish = (values: any) => {
    console.log(values);
    navigate(PATH.RESET_PASSWORD, { state: values });
  };

  return (
    <>
      <div className="w-full">
        <h1 className="text-base font-semibold">Đặt lại mật khẩu</h1>
        <p className="text-sm text-sub mt-1">
          Chúng tôi sẽ gửi đường dẫn để bạn đặt lại mật khẩu
        </p>
      </div>
      <FormWrapper
        form={form}
        submitTitle="Gửi đường dẫn"
        onFinish={handleFinish}
      >
        <Form.Item
          name="email"
          label="Địa chỉ email"
          initialValue={'abc@gmail.com'}
          rules={[
            { required: true, message: 'Hãy nhập email' },
            { pattern: emailRegex, message: 'Email không hợp lệ' },
          ]}
        >
          <Input name="email" placeholder="abc@example.com" />
        </Form.Item>
      </FormWrapper>
    </>
  );
};

export default ForgotPassword;
