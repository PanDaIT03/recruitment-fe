import { Flex } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthAPI, { IResetPasswordParams } from '~/apis/auth';

import { SuccessIconV2 } from '~/assets/svg';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import InputPassword from '~/components/Input/InputPassword';
import useMessageApi from '~/hooks/useMessageApi';
import useQueryParams from '~/hooks/useQueryParams';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { signIn } from '~/store/thunk/auth';
import toast from '~/utils/functions/toast';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { LockOutlined } = icons;

interface IForm {
  password: string;
  reEnterPassword: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [form] = useForm<IForm>();

  const params = useQueryParams();
  const email = params.get('email');
  const token = params.get('token');

  const { currentUser } = useAppSelector((state) => state.auth);
  const [isResetPasswordSuccess, setIsResetPasswordSuccess] = useState(false);

  const { mutate: resetPassword, isPending } = useMessageApi({
    apiFn: (params: IResetPasswordParams) => AuthAPI.resetPassword(params),
    onSuccess: () => {
      setIsResetPasswordSuccess(true);

      if (!email) {
        toast.error('Có lỗi xảy ra: Không tìm thấy email');
        return;
      }

      const { password } = form.getFieldsValue();
      setTimeout(() => {
        dispatch(signIn({ email, password }));
      }, 3000);
    },
  });

  useEffect(() => {
    if (!email || !token) navigate(PATH.ROOT);
  }, [email, token]);

  useEffect(() => {
    if (!currentUser || !Object.values(currentUser).length) return;

    currentUser?.statusCode === 200
      ? (toast.success('Đăng nhập thành công'), navigate(PATH.ROOT))
      : toast.error('Có lỗi xảy ra');
  }, [currentUser]);

  const handleFinish = useCallback(
    (values: IForm) => {
      if (!email || !token) {
        toast.error('Có lỗi xảy ra: Không tìm thấy email');
        return;
      }

      if (values.password !== values.reEnterPassword) {
        form.setFields([
          {
            name: 'reEnterPassword',
            errors: ['"Nhập lại mật khẩu" phải trùng với "Mật khẩu"'],
          },
        ]);
        return;
      }

      const params: IResetPasswordParams = {
        email,
        token,
        password: values.password,
      };
      resetPassword(params);
    },
    [email, token]
  );

  return (
    <>
      {isResetPasswordSuccess ? (
        <Flex vertical justify="center" align="center" className="gap-6">
          <SuccessIconV2 width={64} height={64} />
          <div className="text-center space-y-3">
            <h2 className="text-lg text-green-500 font-semibold">
              Mật khẩu đã được cập nhật
            </h2>
            <p className="text-sm text-sub">
              Bây giờ bạn có thể đăng nhập bằng mật khẩu mới của mình
            </p>
          </div>
          <p className="text-sm text-green-500 animate-pulse">
            Đang tự động chuyển hướng...
          </p>
        </Flex>
      ) : (
        <>
          <div>
            <h2 className="text-lg font-semibold">Đặt lại mật khẩu</h2>
            <p className="text-sm text-sub">
              Vui lòng đặt lại mật khẩu mới cho tài khoản của bạn
            </p>
          </div>
          <FormWrapper
            form={form}
            loading={isPending}
            onFinish={handleFinish}
            submitTitle="Xác nhận"
          >
            <FormItem
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <InputPassword
                placeholder="Tối thiểu 8 ký tự"
                prefix={<LockOutlined />}
              />
            </FormItem>
            <FormItem
              name="reEnterPassword"
              label="Nhập lại mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập lại mật khẩu' },
              ]}
            >
              <InputPassword
                placeholder="Tối thiểu 8 ký tự"
                prefix={<LockOutlined />}
              />
            </FormItem>
          </FormWrapper>
        </>
      )}
    </>
  );
};

export default ResetPassword;
