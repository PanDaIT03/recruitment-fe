import { Flex, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import Countdown from 'antd/es/statistic/Countdown';
import { memo, useState } from 'react';
import OtpInput from 'react-otp-input';

import AuthAPI from '~/apis/auth';
import { LeftArrow } from '~/assets/svg';
import Button from '~/components/Button/Button';
import FormWrapper from '~/components/Form/FormWrapper';
import { useAppSelector } from '~/hooks/useStore';
import toast from '~/utils/functions/toast';
import icons from '~/utils/icons';

interface IProps {
  onReset: () => void;
  onFinish(value: any): void;
}

const { MinusOutlined } = icons;

const initCountdown = {
  deadline: 0,
  isLoading: true,
};

const FormOTPVerify = ({ onReset, onFinish }: IProps) => {
  const [form] = useForm();

  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(initCountdown);

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

  const handleReSendOTP = async () => {
    if (!emailStatus?.email) {
      toast.error('Lỗi không tìm thấy email');
      return;
    }

    setCountdown({
      isLoading: false,
      deadline: Date.now() + 1000 * 10,
    });

    await AuthAPI.sendOTPToEmail(emailStatus.email);
  };

  const handleCountDownFinish = () => {
    setCountdown(initCountdown);
  };

  return (
    <>
      <Tooltip title="Trở về">
        <Button
          displayType="text"
          title={<LeftArrow className="w-5 h-5" />}
          className="w-max fill-[#b6baba] px-2 py-1 rounded-full hover:bg-[#ececec] hover:fill-[#595757]"
          onClick={onReset}
        />
      </Tooltip>
      <div className="rounded-lg bg-green-50 p-4">
        <p className="text-success font-semibold">
          Mã xác minh đã được gửi tới email
          <strong> {emailStatus?.email}</strong> của bạn.
        </p>
        <p className="mt-2 text-sub">
          * Kiểm tra mục spam/quảng cáo nếu không tìm thấy email.
        </p>
      </div>
      <FormWrapper form={form} submitTitle="Đăng nhập" onFinish={handleFinish}>
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
          disabled={!countdown.isLoading}
          className="text-sm text-[#691F74] [&>*]:hover:underline"
          title={
            <Flex gap={4}>
              <p>Gửi lại mã xác minh</p>
              <Countdown
                format="ss"
                className="[&>div]:!p-0"
                value={countdown.deadline}
                loading={countdown.isLoading}
                valueStyle={{
                  padding: 0,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: `${countdown.isLoading ? '#691F74' : '#c2c2c2'}`,
                }}
                onFinish={handleCountDownFinish}
              />
            </Flex>
          }
          onClick={handleReSendOTP}
        />
      </Flex>
    </>
  );
};

export default memo(FormOTPVerify);
