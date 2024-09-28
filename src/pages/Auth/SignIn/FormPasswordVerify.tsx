import { Flex } from 'antd';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Button from '~/components/Button/Button';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import InputPassword from '~/components/Input/InputPassword';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import PATH from '~/utils/path';

export interface IVerifyForm {
  email: string;
  password: string;
}

interface IProps {
  onFinish(values: IVerifyForm): void;
  setIsSignInWithOTP: Dispatch<SetStateAction<boolean>>;
}

const FormPasswordVerify = ({ setIsSignInWithOTP, onFinish }: IProps) => {
  const [form] = useForm<IVerifyForm>();
  const { emailStatus } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!emailStatus) return;
    form.setFieldValue('email', emailStatus.email);
  }, [emailStatus]);

  return (
    <>
      <FormWrapper form={form} submitTitle="Đăng nhập" onFinish={onFinish}>
        <FormItem name="email" label="Địa chỉ email">
          <Input disabled name="email" />
        </FormItem>
        <FormItem
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: 'Hãy nhật mật khẩu' }]}
        >
          <InputPassword name="password" placeholder="Tối thiểu 8 ký tự" />
        </FormItem>
        <Link
          to={PATH.FORGOT_PASSWORD}
          className="block w-full font-semibold text-end text-[#2563eb] mb-6 hover:underline hover:text-[#2563eb]"
        >
          Quên mật khẩu
        </Link>
      </FormWrapper>
      <Flex justify="center">
        <Button
          displayType="text"
          title="Đăng nhập bằng mã OTP"
          className="text-[#691F74] hover:underline"
          onClick={() => setIsSignInWithOTP(true)}
        />
      </Flex>
    </>
  );
};

export default memo(FormPasswordVerify);
