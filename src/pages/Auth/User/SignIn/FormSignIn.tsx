import { FormInstance } from 'antd';
import { memo, useEffect } from 'react';
import { Link } from 'react-router-dom';

import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import { emailRegex } from '~/utils/constant';
import PATH from '~/utils/path';

interface IProps {
  form: FormInstance<any>;
  onFinish(values: any): void;
}

const FormSignIn = ({ form, onFinish }: IProps) => {
  useEffect(() => {
    form.setFieldsValue({
      email: 'daiphucduongvinh203@gmail.com',
      password: 'Duc@05102003',
    });
  }, []);

  return (
    <>
      <FormWrapper form={form} submitTitle="Tiếp tục" onFinish={onFinish}>
        <FormItem
          name="email"
          label="Địa chỉ email"
          className="mb-3"
          rules={[
            { required: true, message: 'Hãy nhập email' },
            { pattern: emailRegex, message: 'Email không hợp lệ' },
          ]}
        >
          <Input name="email" placeholder="abc@example.com" />
        </FormItem>
        <Link
          to={PATH.USER_FORGOT_PASSWORD}
          className="block w-full font-semibold text-end text-[#2563eb] mb-6 hover:underline hover:text-[#2563eb]"
        >
          Quên mật khẩu
        </Link>
      </FormWrapper>
      <div className="flex gap-x-1">
        <span>Chưa có tài khoản?</span>
        <Link
          to={PATH.USER_SIGN_UP}
          className="font-semibold text-end text-[#2563eb] hover:underline hover:text-[#2563eb]"
        >
          Đăng ký tại đây.
        </Link>
      </div>
    </>
  );
};

export default memo(FormSignIn);
