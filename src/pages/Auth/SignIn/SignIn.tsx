import { Divider, Flex } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '~/components/Button/Button';
import GoogleSignInButton from '~/components/Button/GoogleSignInButton';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { resetEmailStatus, resetUser } from '~/store/reducer/auth';
import {
  checkExistedEmail,
  signInWithGoogle,
  verifyOTP,
} from '~/store/thunk/auth';
import { IBaseUser } from '~/types/Auth';
import toast from '~/utils/functions/toast';
import path from '~/utils/path';
import FormSignIn from './FormSignIn';
import FormVerify from './FormVerify';
import { IVerifyOTP } from '~/apis/auth';

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [form] = useForm<IBaseUser>();
  const { currentUser, emailStatus } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (emailStatus?.statusCode) return;
    dispatch(resetEmailStatus());
  }, []);

  useEffect(() => {
    if (!Object.values(currentUser).length) return;

    currentUser?.statusCode === 200
      ? (toast.success(currentUser.message), navigate(path.ROOT))
      : (toast.error(currentUser?.message || 'Có lỗi xảy ra'),
        dispatch(resetUser()));
  }, [currentUser]);

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

  const handleVerify = useCallback(
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
        <div>
          <div className="rounded-lg bg-green-50 p-4 mb-6">
            <p className="text-success font-semibold">
              Mã xác minh đã được gửi tới email
              <strong> {emailStatus.email}</strong> của bạn.
            </p>
            <p className="mt-2 text-sub">
              * Kiểm tra mục spam/quảng cáo nếu không tìm thấy email.
            </p>
          </div>
          <FormVerify onFinish={handleVerify} />
          <Flex justify="center" className="mt-4">
            <Button
              displayType="text"
              title="Gửi lại mã xác minh"
              className="text-[#691F74] hover:underline"
            />
          </Flex>
        </div>
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
