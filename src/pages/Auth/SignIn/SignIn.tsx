import { useGoogleLogin } from '@react-oauth/google';
import { Divider, Image } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { GOOGLE_LOGO } from '~/assets/img';
import Button from '~/components/Button/Button';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { signIn, signInWithGoogle } from '~/store/thunk/auth';
import { IBaseUser } from '~/types/Auth';
import { fetchGoogleUserInfo } from '~/utils/functions/fetchGoogleUserInfo';
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
      : toast.error(currentUser?.message || 'Có lỗi xảy ra');
  }, [currentUser]);

  const handleSignInWithGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfo = await fetchGoogleUserInfo({ response });
        console.log(userInfo);

        dispatch(signInWithGoogle(userInfo));
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleSignIn = async (values: any) => {
    try {
      dispatch(signIn(values));
    } catch (error: any) {
      console.log(error);
    }
  };

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
        <Button
          title="Tiếp tục với Google"
          iconBefore={
            <Image preview={false} src={GOOGLE_LOGO} width={24} height={24} />
          }
          className="w-full text-[#3c4043] border-[#dadce0] hover:border-[#d2e3fc] hover:bg-[#f7fafe]"
          onClick={() => handleSignInWithGoogle()}
        />
      </div>
      <Divider className="!my-0">
        <p className="text-sub text-sm">hoặc</p>
      </Divider>
      <FormSignIn form={form} onFinish={handleSignIn} />
    </>
  );
};

export default SignIn;
