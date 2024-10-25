import { Divider } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthAPI from '~/apis/auth';
import GoogleSignInButton from '~/components/Button/GoogleSignInButton';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { resetUser } from '~/store/reducer/auth';
import { signInWithGoogle } from '~/store/thunk/auth';
import { IBaseUser } from '~/types/Auth';
import toast from '~/utils/functions/toast';
import path from '~/utils/path';
import FormSignUp from './FormSignUp';

export enum ROLE {
  USER = 1,
  EMPLOYER = 3,
}

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [form] = useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!Object.values(currentUser).length) return;

    currentUser?.statusCode === 200
      ? (toast.success(currentUser.message), navigate(path.ROOT))
      : (toast.error(currentUser?.message || 'Có lỗi xảy ra'),
        dispatch(resetUser()));
  }, [currentUser]);

  const handleFinish = useCallback(async (values: IBaseUser) => {
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
  }, []);

  const handleSignUpWithGoogle = useCallback((userInfo: any) => {
    try {
      dispatch(signInWithGoogle(userInfo));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <div className="w-full">
        <h1 className="text-base font-semibold">Đăng ký cho Người tìm việc</h1>
        <p className="text-sm text-sub mt-1">
          Kết nối cộng đồng Người tìm việc và Doanh nghiệp miễn phí
        </p>
      </div>
      <div className="w-full">
        <GoogleSignInButton onClick={handleSignUpWithGoogle} />
      </div>
      <Divider className="!my-0">
        <p className="text-sub text-sm">hoặc</p>
      </Divider>
      <FormSignUp loading={isLoading} form={form} onFinish={handleFinish} />
    </>
  );
};

export default SignUp;
