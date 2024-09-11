import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { Divider } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { jwtDecode } from 'jwt-decode';

import { useAppDispatch } from '~/hooks/useStore';
import { signIn, signInWithGoogle } from '~/store/thunk/auth';
import { IBaseUser } from '~/types/Auth';
import FormSignIn from './FormSignIn';

const SignIn = () => {
  const dispatch = useAppDispatch();
  const [form] = useForm<IBaseUser>();

  // const user = useAppSelector((state) => state.auth);

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);

  const handleSignIn = async (values: any) => {
    const { email, password } = values;
    dispatch(signIn({ email: email, password: password }));
  };

  const handleSignInWithGoogleSuccess = (response: CredentialResponse) => {
    try {
      const token = response.credential;
      if (!token) return;

      const decodedToken: any = jwtDecode(token);
      dispatch(signInWithGoogle(decodedToken));
    } catch (error) {
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
      <div className="flex w-full justify-center">
        <GoogleLogin onSuccess={handleSignInWithGoogleSuccess} />
      </div>
      <Divider className="!my-0">
        <p className="text-sub text-sm">hoặc</p>
      </Divider>
      <FormSignIn form={form} onFinish={handleSignIn} />
    </>
  );
};

export default SignIn;
