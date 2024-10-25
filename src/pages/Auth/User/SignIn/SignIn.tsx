import { Divider } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthAPI, { IVerifyOTP } from '~/apis/auth';
import GoogleSignInButton from '~/components/Button/GoogleSignInButton';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { resetEmailStatus, resetUser } from '~/store/reducer/auth';
import {
  checkExistedEmail,
  signIn,
  signInWithGoogle,
  verifyOTP,
} from '~/store/thunk/auth';
import { IBaseUser } from '~/types/Auth';
import toast from '~/utils/functions/toast';
import path from '~/utils/path';
import FormSignIn from './FormSignIn';
import FormOTPVerify from './FormOTPVerify';
import FormPasswordVerify, { IVerifyForm } from './FormPasswordVerify';

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [form] = useForm<IBaseUser>();

  const [isSignInWithOTP, setIsSignInWithOTP] = useState(false);
  const { currentUser, emailStatus, loading } = useAppSelector(
    (state) => state.auth
  );

  const handleBackToSignIn = useCallback(() => {
    dispatch(resetEmailStatus());
    setIsSignInWithOTP(false);
  }, []);

  useEffect(() => {
    if (!emailStatus?.statusCode) return;
    handleBackToSignIn();
  }, []);

  useEffect(() => {
    if (!Object.values(currentUser).length) return;

    currentUser?.statusCode === 200
      ? (toast.success(currentUser.message), navigate(path.ROOT))
      : (toast.error(currentUser?.message || 'Có lỗi xảy ra'),
        dispatch(resetUser()));
  }, [currentUser]);

  useEffect(() => {
    if (!emailStatus) return;

    const { email, statusCode } = emailStatus;
    const sendOTP = async () => await AuthAPI.sendOTPToEmail(email);

    statusCode === 200 && isSignInWithOTP && sendOTP();
  }, [emailStatus, isSignInWithOTP]);

  const handleSignInWithGoogle = useCallback((userInfo: any) => {
    try {
      dispatch(signInWithGoogle(userInfo));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleCheckExistedEmail = useCallback(
    (value: any) => {
      try {
        const { email } = value;
        dispatch(checkExistedEmail(email));
      } catch (error: any) {
        console.log(error);
      }
    },
    [emailStatus]
  );

  const handlePasswordVerify = (values: IVerifyForm) => {
    try {
      const { email, password } = values;
      dispatch(signIn({ email: email, password: password }));
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleOTPVerify = useCallback(
    (value: any) => {
      if (!emailStatus) return;

      try {
        const params: IVerifyOTP = {
          email: emailStatus.email,
          otp: parseInt(value.verifyCode),
        };

        dispatch(verifyOTP(params));
      } catch (error: any) {
        console.log(error);
      }
    },
    [emailStatus]
  );

  return (
    <>
      {emailStatus?.statusCode === 200 ? (
        <>
          {emailStatus.hasPassword && !isSignInWithOTP ? (
            <FormPasswordVerify
              isLoading={loading}
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
