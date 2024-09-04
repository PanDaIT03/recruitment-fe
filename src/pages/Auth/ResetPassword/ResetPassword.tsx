import { useLocation } from 'react-router-dom';
import AuthWrapper from '~/components/AuthWrapper/AuthWrapper';
import icons from '~/utils/icons';

const { CheckCircleTwoTone } = icons;

const ResetPassword = () => {
  const location = useLocation();
  console.log(location);

  return (
    <AuthWrapper
      title={
        <div className="flex items-center flex-col gap-y-3">
          <CheckCircleTwoTone
            twoToneColor="#52c41a"
            className="text-[48px] mb-3"
          />
          <h1 className="text-lg font-semibold">Gửi email thành công</h1>
          <span className="text-sm">
            Đường dẫn đặt lại mật khẩu đã được gửi tới email asd@gmail.com của
            bạn.
          </span>
        </div>
      }
      subTitle=""
    >
      ResetPassword
    </AuthWrapper>
  );
};

export default ResetPassword;
