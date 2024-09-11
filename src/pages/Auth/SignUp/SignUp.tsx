import { useGoogleLogin } from '@react-oauth/google';
import { Divider, Image } from 'antd';
import { useForm } from 'antd/es/form/Form';

import { GOOGLE_LOGO } from '~/assets/img';
import Button from '~/components/Button/Button';
import { useAppDispatch } from '~/hooks/useStore';
<<<<<<< HEAD
import { signInWithGoogle } from '~/store/thunk/auth';
import FormSignUp from './FormSignUp';
import { apiSignUp } from '~/services/auth';
import toast from '~/utils/functions/toast';
import { IBaseUser } from '~/types/Auth';

enum ROLE {
  USER = 1,
  EMPLOYER = 2,
}
=======
import apiSignUp from '~/services/auth';
import { signInWithGoogle } from '~/store/thunk/auth';
import { fetchGoogleUserInfo } from '~/utils/functions/fetchGoogleUserInfo';
import FormSignUp from './FormSignUp';
>>>>>>> features

const SignUp = () => {
  const dispatch = useAppDispatch();
  const [form] = useForm();

<<<<<<< HEAD
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
=======
  const handleSignUpWithGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfo = await fetchGoogleUserInfo({ response });
        dispatch(signInWithGoogle(userInfo));
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleFinish = (values: any) => {
    apiSignUp(values);
>>>>>>> features
  };

  return (
    <>
      <div className="w-full">
        <h1 className="text-base font-semibold">Đăng ký cho Người tìm việc</h1>
        <p className="text-sm text-sub mt-1">
          Kết nối cộng đồng Người tìm việc và Doanh nghiệp miễn phí
        </p>
      </div>
      <div className="w-full">
        <Button
          title="Tiếp tục với Google"
          iconBefore={
            <Image preview={false} src={GOOGLE_LOGO} width={24} height={24} />
          }
          className="w-full text-[#3c4043] border-[#dadce0] hover:border-[#d2e3fc] hover:bg-[#f7fafe]"
          onClick={() => handleSignUpWithGoogle()}
        />
      </div>
      <Divider className="!my-0">
        <p className="text-sub text-sm">hoặc</p>
      </Divider>
      <FormSignUp form={form} onFinish={handleFinish} />
    </>
  );
};

export default SignUp;
