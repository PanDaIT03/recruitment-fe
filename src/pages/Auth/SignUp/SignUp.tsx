import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { Col, Divider } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { jwtDecode } from 'jwt-decode';

import { useAppDispatch } from '~/hooks/useStore';
import { signInWithGoogle } from '~/store/thunk/auth';
import FormSignUp from './FormSignUp';
import { apiSignUp } from '~/services/auth';
import toast from '~/utils/functions/toast';
import { IBaseUser } from '~/types/Auth';

enum ROLE {
  USER = 1,
  EMPLOYER = 2,
}

const SignUp = () => {
  const dispatch = useAppDispatch();
  const [form] = useForm();

  const handleFinish = async (values: IBaseUser) => {
    const payload = { ...values, roleId: ROLE.USER };
    try {
      const response = await apiSignUp(payload);
      const message = response?.message;

      response.statusCode === 200
        ? toast.success(message)
        : toast.error(message);

      form.resetFields();
    } catch (error: any) {
      console.log('Unexpected error', error);
    }
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
    <Col>
      <div className="flex flex-col gap-y-6 bg-white p-6 border rounded-xl shadow-md">
        <div className="w-full">
          <h1 className="text-base font-semibold">
            Đăng ký cho Người tìm việc
          </h1>
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
      </div>
    </Col>
  );
};

export default SignUp;
