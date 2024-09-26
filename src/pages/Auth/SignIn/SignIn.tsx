import { Divider } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import GoogleSignInButton from '~/components/Button/GoogleSignInButton';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { resetUser } from '~/store/reducer/auth';
import { signIn, signInWithGoogle } from '~/store/thunk/auth';
import { IBaseUser } from '~/types/Auth';
import toast from '~/utils/functions/toast';
import path from '~/utils/path';
import FormSignIn from './FormSignIn';

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [form] = useForm<IBaseUser>();

  const { currentUser } = useAppSelector((state) => state.auth);

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

  const handleSignIn = useCallback(async (values: any) => {
    try {
      dispatch(signIn(values));
    } catch (error: any) {
      console.log(error);
    }
  }, []);

  return (
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
      <FormSignIn form={form} onFinish={handleSignIn} />
    </>
  );
};

export default SignIn;
