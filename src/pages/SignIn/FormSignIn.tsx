import { Form, FormInstance } from 'antd';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import FormWrapper from '~/components/FormWrapper/FormWrapper';
import InputForm from '~/components/Input/Input';
import PATH from '~/utils/path';

interface IProps {
  form: FormInstance<any>;
  onFinish(values: any): void;
}

const FormSignIn = ({ form, onFinish }: IProps) => {
  return (
    <>
      <FormWrapper form={form} submitTitle="Đăng nhập" onFinish={onFinish}>
        <Form.Item
          name="userName"
          label="Địa chỉ email"
          rules={[{ required: true, message: 'Hãy nhập email' }]}
        >
          <InputForm name="userName" placeholder="abc@example.com" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: 'Hãy nhập mật khẩu' }]}
        >
          <InputForm name="password" placeholder="Nhập mật khẩu" />
        </Form.Item>
        <Link
          to={PATH.SIGIN}
          className="block w-full font-semibold text-end text-[#2563eb] mb-6 hover:underline hover:text-[#2563eb]"
        >
          Quên mật khẩu
        </Link>
      </FormWrapper>
      <div className="flex gap-x-1">
        <span>Chưa có tài khoản?</span>
        <Link
          to={PATH.SIGIN}
          className="font-semibold text-end text-[#2563eb] hover:underline hover:text-[#2563eb]"
        >
          Đăng ký tại đây.
        </Link>
      </div>
    </>
  );
};

export default memo(FormSignIn);
