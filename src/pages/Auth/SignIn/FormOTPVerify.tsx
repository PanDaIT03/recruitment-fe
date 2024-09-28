import { Flex } from 'antd';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import { memo, useState } from 'react';
import OtpInput from 'react-otp-input';

import Button from '~/components/Button/Button';
import FormWrapper from '~/components/Form/FormWrapper';
import { useAppSelector } from '~/hooks/useStore';
import icons from '~/utils/icons';

interface IProps {
  onFinish(value: any): void;
}

const { MinusOutlined } = icons;

const FormOTPVerify = ({ onFinish }: IProps) => {
  const [form] = useForm();
  const [otp, setOtp] = useState('');

  const { emailStatus } = useAppSelector((state) => state.auth);

  const handleChange = (otp: string) => {
    setOtp(otp);
  };

  const handleFinish = (value: any) => {
    const { verifyCode } = value;

    if (verifyCode.length < 6) {
      form.setFields([
        {
          name: 'verifyCode',
          errors: ['Mã OTP phải đủ 6 số'],
        },
      ]);
      return;
    }

    onFinish(value);
  };

  return (
    <>
      <div className="rounded-lg bg-green-50 p-4">
        <p className="text-success font-semibold">
          Mã xác minh đã được gửi tới email
          <strong> {emailStatus?.email}</strong> của bạn.
        </p>
        <p className="mt-2 text-sub">
          * Kiểm tra mục spam/quảng cáo nếu không tìm thấy email.
        </p>
      </div>
      <FormWrapper
        form={form}
        submitTitle="Đăng nhập"
        onFinish={handleFinish}
      >
        <FormItem
          name="verifyCode"
          className="flex justify-center"
          label={<p className="w-full text-center">Mã xác minh</p>}
          rules={[{ required: true, message: 'Hãy nhập mã xác minh của bạn' }]}
        >
          <OtpInput
            value={otp}
            numInputs={6}
            shouldAutoFocus
            onChange={handleChange}
            renderSeparator={(index) =>
              index === 2 && <MinusOutlined className="mx-2" />
            }
            inputStyle={{
              width: '40px',
              height: '40px',
              fontWeight: 'bold',
              border: '1px solid #d2cfcce6',
            }}
            renderInput={(props, index) => {
              let appliedClass = '';
              const customClasses = {
                'border-left': 'rounded-s-lg',
                'border-right': 'rounded-e-lg',
              };

              if ([0, 3].includes(index))
                appliedClass = customClasses['border-left'];
              if ([2, 5].includes(index))
                appliedClass = customClasses['border-right'];

              return <input {...props} className={appliedClass} />;
            }}
          />
        </FormItem>
      </FormWrapper>
      <Flex justify="center">
        <Button
          displayType="text"
          title="Gửi lại mã xác minh"
          className="text-[#691F74] hover:underline"
        />
      </Flex>
    </>
  );
};

export default memo(FormOTPVerify);
