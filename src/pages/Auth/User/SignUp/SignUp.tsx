import { useMutation } from '@tanstack/react-query';
import { Divider } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthAPI, { ISignUpParams } from '~/apis/auth';
import GoogleSignInButton from '~/components/Button/GoogleSignInButton';
import { useMessage } from '~/contexts/MessageProvider';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { resetUser } from '~/store/reducer/auth';
import { signInWithGoogle } from '~/store/thunk/auth';
import { IBaseUser } from '~/types/Auth';
import { ROLE } from '~/types/Role';
import toast from '~/utils/functions/toast';
import PATH from '~/utils/path';
import ModalSignUpSuccess from '../../components/ModalSignUpSuccess/ModalSignUpSuccess';
import FormSignUp from './FormSignUp';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { messageApi } = useMessage();

  const [form] = useForm();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const { roles } = useAppSelector((state) => state.role);
  const { currentUser } = useAppSelector((state) => state.auth);

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: (params: ISignUpParams) => AuthAPI.signUp(params),
    onSuccess: (res) => {
      if (res?.statusCode === 200) {
        setIsOpenModal(true);
        return;
      }

      messageApi.error(`Có lỗi xảy ra: ${res?.message}`);
    },
    onError: (error: any) =>
      messageApi.error(`Có lỗi xảy ra: ${error?.response?.data?.message}`),
  });

  useEffect(() => {
    if (!Object.values(currentUser).length) return;

    currentUser?.statusCode === 200
      ? (toast.success('Đăng nhập thành công'), navigate(PATH.ROOT))
      : (toast.error('Có lỗi xảy ra'), dispatch(resetUser()));
  }, [currentUser]);

  const handleFinish = useCallback(
    async (values: IBaseUser) => {
      const roleId = roles.find((role) => role.title === ROLE.USER)?.id;

      if (!roleId) {
        toast.error('Lỗi không tìm thấy chức vụ');
        return;
      }

      const params: ISignUpParams = { ...values, roleId };
      signUp(params);
    },
    [roles]
  );

  const handleSignUpWithGoogle = useCallback((userInfo: any) => {
    try {
      dispatch(signInWithGoogle(userInfo));
    } catch (error) {
      console.log(error);
    }
  }, []);

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
      <ModalSignUpSuccess
        isOpenModal={isOpenModal}
        email={form.getFieldValue('email')}
        setIsOpenModal={setIsOpenModal}
      />
    </>
  );
};

export default SignUp;
