import { useMutation } from '@tanstack/react-query';
import { Divider } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import AuthAPI, { IVerifyOTP } from '~/apis/auth';
import GoogleSignInButton from '~/components/Button/GoogleSignInButton';
import { useMessage } from '~/contexts/MessageProvider';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { resetEmailStatus, resetUser } from '~/store/reducer/auth';
import {
  checkExistedEmail,
  getMe,
  signIn,
  signInWithGoogle,
} from '~/store/thunk/auth';
import { getAllRoles } from '~/store/thunk/role';
import { IBaseUser } from '~/types/Auth';
import toast from '~/utils/functions/toast';
import path from '~/utils/path';
import FormOTPVerify from './FormOTPVerify';
import FormPasswordVerify, { IVerifyForm } from './FormPasswordVerify';
import FormSignIn from './FormSignIn';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { messageApi } = useMessage();

  const [form] = useForm<IBaseUser>();
  const { currentUser, emailStatus, loading } = useAppSelector(
    (state) => state.auth
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isSignInWithOTP, setIsSignInWithOTP] = useState(false);

  const { mutate: verifyOTP, isPending: isVerifyOTPPending } = useMutation({
    mutationFn: (params: IVerifyOTP) => AuthAPI.verifyOTP(params),
    onSuccess: () => {
      dispatch(getMe());
      dispatch(getAllRoles({}));
    },
    onError: (error: any) => messageApi.error(error?.response?.data?.message),
  });

  const { mutate: sendOTPToEmail } = useMutation({
    mutationFn: (email: string) => AuthAPI.sendOTPToEmail(email),
    onSuccess: (res) => messageApi.success(res?.message),
    onError: (error: any) => messageApi.error(error?.response?.data?.message),
  });

  const handleBackToSignIn = useCallback(() => {
    dispatch(resetEmailStatus());
    setIsSignInWithOTP(false);
  }, []);

  useEffect(() => {
    if (!emailStatus?.statusCode) return;
    handleBackToSignIn();
  }, []);

  useEffect(() => {
    const { state } = location;
    if (state && state?.email) form.setFieldValue('email', state.email);
  }, [location]);

  useEffect(() => {
    if (!Object.values(currentUser).length) return;

    currentUser?.statusCode === 200
      ? (toast.success('Đăng nhập thành công'), navigate(path.ROOT))
      : (toast.error('Có lỗi xảy ra'), dispatch(resetUser()));
  }, [currentUser]);

  useEffect(() => {
    if (!emailStatus) return;

    const { email, statusCode } = emailStatus;
    statusCode === 200 && isSignInWithOTP && sendOTPToEmail(email);
  }, [emailStatus, isSignInWithOTP]);

  const handleSignInWithGoogle = useCallback((userInfo: any) => {
    setIsLoading(true);
    try {
      dispatch(signInWithGoogle(userInfo)).then(() => setIsLoading(false));
    } catch (error) {
      setIsLoading(false);
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

      const params: IVerifyOTP = {
        email: emailStatus.email,
        otp: parseInt(value.verifyCode),
      };

      verifyOTP(params);
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
              loading={isVerifyOTPPending}
              onFinish={handleOTPVerify}
              onReset={handleBackToSignIn}
            />
          )}
        </>
      ) : (
        <>
          <div className="w-full">
            <h1 className="text-base font-semibold">Đăng nhập</h1>
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
          <FormSignIn
            form={form}
            loading={loading || isLoading}
            onFinish={handleCheckExistedEmail}
          />
        </>
      )}
    </>
  );
};

export default SignIn;
