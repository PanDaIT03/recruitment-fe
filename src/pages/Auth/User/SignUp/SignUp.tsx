import { useMutation } from '@tanstack/react-query';
import { Divider, Flex } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthAPI, { ISignUpParams } from '~/apis/auth';
import { Success } from '~/assets/svg';
import Button from '~/components/Button/Button';
import GoogleSignInButton from '~/components/Button/GoogleSignInButton';
import Modal from '~/components/Modal/Modal';
import { useMessage } from '~/contexts/MessageProvider';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { resetUser } from '~/store/reducer/auth';
import { signInWithGoogle } from '~/store/thunk/auth';
import { IBaseUser, ROLE } from '~/types/Auth';
import toast from '~/utils/functions/toast';
import PATH from '~/utils/path';
import FormSignUp from './FormSignUp';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { messageApi } = useMessage();

  const [form] = useForm();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const { currentUser } = useAppSelector((state) => state.auth);

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: (params: ISignUpParams) => AuthAPI.signUp(params),
    onSuccess: () => setIsOpenModal(true),
    onError: (error: any) =>
      messageApi.error(`Có lỗi xảy ra: ${error?.response?.data?.message}`),
  });

  useEffect(() => {
    if (!Object.values(currentUser).length) return;

    currentUser?.statusCode === 200
      ? (toast.success('Đăng nhập thành công'), navigate(PATH.ROOT))
      : (toast.error('Có lỗi xảy ra'), dispatch(resetUser()));
  }, [currentUser]);

  const handleFinish = useCallback(async (values: IBaseUser) => {
    const params: ISignUpParams = { ...values, roleId: ROLE.USER };
    signUp(params);
  }, []);

  const handleSignUpWithGoogle = useCallback((userInfo: any) => {
    try {
      dispatch(signInWithGoogle(userInfo));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleRedirectToSignIn = useCallback(() => {
    const email = form.getFieldValue('email');

    setIsOpenModal(false);
    navigate(PATH.USER_SIGN_IN, { state: { email } });
  }, [form]);

  return (
    <>
      <div className="w-full">
        <h1 className="text-base font-semibold">Đăng ký cho Người tìm việc</h1>
        <p className="text-sm text-sub mt-1">
          Kết nối cộng đồng Người tìm việc và Doanh nghiệp miễn phí
        </p>
      </div>
      <div className="w-full">
        <GoogleSignInButton onClick={handleSignUpWithGoogle} />
      </div>
      <Divider className="!my-0">
        <p className="text-sub text-sm">hoặc</p>
      </Divider>
      <FormSignUp loading={isPending} form={form} onFinish={handleFinish} />
      <Modal
        isOpen={isOpenModal}
        title="Đăng ký thành công"
        className="min-w-[550px]"
        footer={
          <Flex justify="end" gap={12}>
            <Button title="Đóng" onClick={() => setIsOpenModal(false)} />
            <Button
              fill
              title="Đến trang đăng nhập"
              onClick={handleRedirectToSignIn}
            />
          </Flex>
        }
      >
        <Flex vertical align="center" className="text-center" gap={8}>
          <Success width={100} height={100} />
          <p className="text-lg font-semibold text-green-600">
            Chúc mừng bạn đã đăng ký tài khoản thành công!
          </p>
          <p className="text-sm text-sub font-medium">
            Bạn có thể chuyển đến trang đăng nhập để sử dụng tài khoản của mình.
          </p>
        </Flex>
      </Modal>
    </>
  );
};

export default SignUp;
