import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { Col, Divider } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { jwtDecode } from 'jwt-decode';

import { useAppDispatch } from '~/hooks/useStore';
import { signInWithGoogle } from '~/store/thunk/auth';
import FormSignUp from './FormSignUp';

const SignUp = () => {
  const dispatch = useAppDispatch();
  const [form] = useForm();

  const handleFinish = (values: any) => {
    console.log(values);
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
        <h1 className="text-base font-semibold">Đăng ký cho Người tìm việc</h1>
        <p className="text-sm text-sub mt-1">
          Kết nối cộng đồng Người tìm việc và Doanh nghiệp miễn phí
        </p>
      </div>
      <div className="flex w-full justify-center">
        <GoogleLogin onSuccess={handleSignInWithGoogleSuccess} />
      </div>
      <Divider className="!my-0">
        <p className="text-sub text-sm">hoặc</p>
      </Divider>
      <FormSignUp form={form} onFinish={handleFinish} />
    </>
  );
};

export default SignUp;
