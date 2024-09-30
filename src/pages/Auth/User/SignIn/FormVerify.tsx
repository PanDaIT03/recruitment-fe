import { Input, InputNumber } from 'antd';
import { InputOTP } from 'antd-input-otp';
import { FormInstance } from 'antd/es/form/Form';
import { useEffect } from 'react';

import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import { useAppSelector } from '~/hooks/useStore';

interface IProps {
  className?: string;
  form: FormInstance<any>;
  onFinish(values: any): void;
}

const FormVerify = ({ className, form, onFinish }: IProps) => {
  const { emailVerification } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log(emailVerification);
  }, [emailVerification]);

  return (
    <>
      <FormWrapper
        form={form}
        className={className}
        submitTitle="Đăng nhập"
        onFinish={onFinish}
      >
        <FormItem label="Mã xác minh" rules={[{ required: true, message: '' }]}>
          <InputOTP
            autoFocus
            maxLength={6}
            inputType="numeric"
            autoSubmit={onFinish}
          />
        </FormItem>
        {/* <Form.Item
      name="password"
      label="Mật khẩu"
      rules={[
        { required: true, message: 'Hãy nhập mật khẩu' },
        {
          pattern: passwordRegex,
          message: 'Mật khẩu phải có ít nhất 8 ký tự',
        },
      ]}
    >
      <InputPassword name="password" placeholder="Nhập mật khẩu" />
    </Form.Item> */}
      </FormWrapper>
    </>
  );
};

export default FormVerify;
