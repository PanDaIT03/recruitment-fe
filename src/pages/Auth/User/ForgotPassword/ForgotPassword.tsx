import { Flex } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useState } from 'react';

import AuthAPI from '~/apis/auth';
import { Success } from '~/assets/svg';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import useMessageApi from '~/hooks/useMessageApi';
import { emailRegex } from '~/utils/constant';

interface IForm {
  email: string;
}

const ForgotPassword = () => {
  const [form] = useForm<IForm>();
  const [isSendUrlSuccess, setIsSendUrlSuccess] = useState(false);

  const { isPending, mutate: sendResetPasswordUrl } = useMessageApi({
    apiFn: (email: string) => AuthAPI.sendResetPasswordUrl(email),
    onSuccess: () => {
      setIsSendUrlSuccess(true);
    },
  });

  const handleFinish = async (value: IForm) => {
    const { email } = value;
    sendResetPasswordUrl(email);
  };

  return (
    <>
      {isSendUrlSuccess ? (
        <Flex vertical justify="center" align="center" className="gap-6">
          <Success width={64} height={64} />
          <div className="text-center space-y-3">
            <h2 className="text-lg font-semibold">Gửi email thành công</h2>
            <p className="text-sm">
              Đường dẫn đặt lại mật khẩu đã được gửi tới email{' '}
              <strong>{form.getFieldValue('email')}</strong> của bạn.
            </p>
            <p className="text-sm text-yellow-600">
              * Kiểm tra mục spam/quảng cáo nếu không tìm thấy email.
            </p>
          </div>
        </Flex>
      ) : (
        <>
          <div className="w-full">
            <h1 className="text-base font-semibold">Đặt lại mật khẩu</h1>
            <p className="text-sm text-sub mt-1">
              Chúng tôi sẽ gửi đường dẫn để bạn đặt lại mật khẩu
            </p>
          </div>
          <FormWrapper
            form={form}
            loading={isPending}
            submitTitle="Gửi đường dẫn"
            onFinish={handleFinish}
          >
            <FormItem
              name="email"
              label="Địa chỉ email"
              rules={[
                { required: true, message: 'Hãy nhập email' },
                { pattern: emailRegex, message: 'Email không hợp lệ' },
              ]}
            >
              <Input name="email" placeholder="abc@example.com" />
            </FormItem>
          </FormWrapper>
        </>
      )}
    </>
  );
};

export default ForgotPassword;
