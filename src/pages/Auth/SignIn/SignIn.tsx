import { useGoogleLogin } from '@react-oauth/google';
import { Divider, Image } from 'antd';
import { useForm } from 'antd/es/form/Form';

import { GOOGLE_LOGO } from '~/assets/img';
import Button from '~/components/Button/Button';
import { useAppDispatch } from '~/hooks/useStore';
import { signIn, signInWithGoogle } from '~/store/thunk/auth';
import { IBaseUser } from '~/types/Auth';
import { fetchGoogleUserInfo } from '~/utils/functions/fetchGoogleUserInfo';
import FormSignIn from './FormSignIn';

const SignIn = () => {
  const dispatch = useAppDispatch();
  const [form] = useForm<IBaseUser>();

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
    const { email, password } = values;
    dispatch(signIn({ email: email, password: password }));
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
