import { Divider } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthAPI, { IVerifyOTP } from '~/apis/auth';
import GoogleSignInButton from '~/components/Button/GoogleSignInButton';
import { useUser } from '~/contexts/useContext';
import { useAppDispatch } from '~/hooks/useStore';
import { resetEmailStatus, resetUser } from '~/store/reducer/auth';
import {
  signIn,
  signInWithGoogle,
  TYPE_LOGIN,
  verifyOTP,
} from '~/store/thunk/auth';
import { IBaseUser, IUser } from '~/types/Auth';
import toast from '~/utils/functions/toast';
import path from '~/utils/path';
import FormOTPVerify from './FormOTPVerify';
import FormPasswordVerify, { IVerifyForm } from './FormPasswordVerify';
import FormSignIn from './FormSignIn';

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [form] = useForm<IBaseUser>();

  const [isSignInWithOTP, setIsSignInWithOTP] = useState(false);
  const { user, setUser } = useUser();

  const handleBackToSignIn = useCallback(() => {
    dispatch(resetEmailStatus());
    setIsSignInWithOTP(false);
  }, []);

  useEffect(() => {
    if (!user?.emailStatus?.statusCode) return;
    handleBackToSignIn();
  }, []);

  useEffect(() => {
    if (!user?.emailStatus) return;

    const { email, statusCode } = user?.emailStatus;
    const sendOTP = async () => await AuthAPI.sendOTPToEmail(email);

    statusCode === 200 && isSignInWithOTP && sendOTP();
  }, [user?.emailStatus, isSignInWithOTP]);

  const handleSignInWithGoogle = useCallback((userInfo: any) => {
    try {
      dispatch(signInWithGoogle(userInfo));
    } catch (error) {
      console.log(error);
    }
  }, []);
  console.log(user);
  const handleCheckExistedEmail = useCallback(
    async (value: any) => {
      try {
        const { email } = value;
        const response = await AuthAPI.checkExistedEmail(email);

        setUser((prevUser: IUser | null) => ({
          ...prevUser,
          emailStatus: response,
        }));
      } catch (error: any) {
        console.log(error);
      }
    },
    [user?.emailStatus]
  );

  const handlePasswordVerify = async (values: IVerifyForm) => {
    try {
      const payload = { ...values, type: TYPE_LOGIN.TYPE_SYSTEM };
      const response = await AuthAPI.signIn(payload);

      response?.statusCode === 200
        ? (toast.success(response.message), navigate(path.ROOT))
        : (toast.error(response?.message || 'Có lỗi xảy ra'),
          dispatch(resetUser()));
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleOTPVerify = useCallback(
    (value: any) => {
      if (!user?.emailStatus) return;

      try {
        const params: IVerifyOTP = {
          email: user?.emailStatus.email,
          otp: parseInt(value.verifyCode),
        };

        dispatch(verifyOTP(params));
      } catch (error: any) {
        console.log(error);
      }
    },
    [user?.emailStatus]
  );

  return (
    <>
      {user?.emailStatus?.statusCode === 200 ? (
        <>
          {user?.emailStatus.hasPassword && !isSignInWithOTP ? (
            <FormPasswordVerify
              onReset={handleBackToSignIn}
              onFinish={handlePasswordVerify}
              setIsSignInWithOTP={setIsSignInWithOTP}
            />
          ) : (
            <FormOTPVerify
              onFinish={handleOTPVerify}
              onReset={handleBackToSignIn}
            />
          )}
        </>
      ) : (
        <>
          <div className="w-full">
            <h1 className="text-base font-semibold">
              Đăng nhập cho Người tìm việc
            </h1>
            <p className="text-sm text-sub mt-1">
              Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục
            </p>
          </div>
          <div className="w-full">
            <GoogleSignInButton onClick={handleSignInWithGoogle} />
          </div>
          <Divider className="!my-0">
            <p className="text-sub text-sm">hoặc</p>
          </Divider>
          <FormSignIn form={form} onFinish={handleCheckExistedEmail} />
        </>
      )}
    </>
  );
};

export default SignIn;
