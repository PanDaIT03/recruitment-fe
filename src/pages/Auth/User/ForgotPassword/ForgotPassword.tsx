import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { resetForgotPasswordStatus } from '~/store/reducer/auth';
import { forgotPassword } from '~/store/thunk/auth';
import { emailRegex } from '~/utils/constant';
import PATH from '~/utils/path';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [form] = useForm();
  const { forgotPasswordStatus } = useAppSelector((state) => state.auth);

  useEffect(() => {
    form.setFieldValue('email', 'daiphucduongvinh203@gmail.com');

    if (!forgotPasswordStatus) return;
    dispatch(resetForgotPasswordStatus());
  }, []);

  useEffect(() => {
    if (!forgotPasswordStatus) return;

    const email = form.getFieldValue('email');
    const { statusCode } = forgotPasswordStatus;

    statusCode === 200 && navigate(PATH.USER_RESET_PASSWORD, { state: email });
  }, [forgotPasswordStatus]);

  const handleFinish = async (value: any) => {
    const { email } = value;
    dispatch(forgotPassword(email));
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
