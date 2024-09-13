import { useGoogleLogin } from '@react-oauth/google';
import { Divider, Image } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useState } from 'react';

import AuthAPI from '~/apis/auth';
import { GOOGLE_LOGO } from '~/assets/img';
import Button from '~/components/Button/Button';
import { useAppDispatch } from '~/hooks/useStore';
import { signInWithGoogle } from '~/store/thunk/auth';
import { IBaseUser } from '~/types/Auth';
import { fetchGoogleUserInfo } from '~/utils/functions/fetchGoogleUserInfo';
import toast from '~/utils/functions/toast';
import FormSignUp from './FormSignUp';
import GoogleSignInButton from '~/components/Button/GoogleSignInButton';

enum ROLE {
  USER = 1,
  EMPLOYER = 2,
}

const SignUp = () => {
  const dispatch = useAppDispatch();
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFinish = async (values: IBaseUser) => {
    const payload = { ...values, roleId: ROLE.USER };
    setIsLoading(true);
    try {
      const response = await AuthAPI.signUp(payload);
      const { statusCode, message } = response;

      toast[statusCode === 200 ? 'success' : 'error'](message);
      if (statusCode === 200) form.resetFields();

      setIsLoading(false);
    } catch (error: any) {
      console.log('Unexpected error', error);
    }
  };

  const handleSignUpWithGoogle = (userInfo: any) => {
    try {
      dispatch(signInWithGoogle(userInfo));
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <>
      <div className="w-full">
        <h1 className="text-base font-semibold">Đăng ký cho Người tìm việc</h1>
        <p className="text-sm text-sub mt-1">
          Kết nối cộng đồng Người tìm việc và Doanh nghiệp miễn phí
        </p>
      </div>
      <div className="w-full">
        <GoogleSignInButton onClick={handleSignUpWithGoogle}/>
      </div>
      <Divider className="!my-0">
        <p className="text-sub text-sm">hoặc</p>
      </Divider>
      <FormSignUp form={form} onFinish={handleFinish} loading={isLoading} />
    </>
  );
};

export default SignUp;
