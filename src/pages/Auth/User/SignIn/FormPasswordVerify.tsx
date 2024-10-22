import { Flex, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import { Dispatch, memo, SetStateAction, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { LeftArrow } from '~/assets/svg';
import Button from '~/components/Button/Button';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import InputPassword from '~/components/Input/InputPassword';
import { useUser } from '~/contexts/useContext';
import { useAppSelector } from '~/hooks/useStore';
import PATH from '~/utils/path';

export interface IVerifyForm {
  email: string;
  password: string;
}

interface IProps {
  onReset: () => void;
  onFinish(values: IVerifyForm): void;
  setIsSignInWithOTP: Dispatch<SetStateAction<boolean>>;
}

const FormPasswordVerify = ({
  onReset,
  onFinish,
  setIsSignInWithOTP,
}: IProps) => {
  const [form] = useForm<IVerifyForm>();
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
    form.setFieldValue('email', user.emailStatus?.email);
  }, [user]);

  return (
    <>
      <Tooltip title="Trở về">
        <Button
          displayType="text"
          title={<LeftArrow className="w-5 h-5" />}
          className="w-max fill-[#b6baba] px-2 py-1 rounded-full hover:bg-[#ececec] hover:fill-[#595757]"
          onClick={onReset}
        />
      </Tooltip>
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
          to={PATH.USER_FORGOT_PASSWORD}
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
