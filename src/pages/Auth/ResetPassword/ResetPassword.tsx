import { useLocation, useNavigate } from 'react-router-dom';
import icons from '~/utils/icons';

const { CheckCircleTwoTone } = icons;

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // if (!location.state)
  //   // navigate(PATH.ROOT);
  //   return <Navigate to={PATH.ROOT} replace />;

  // useEffect(() => {
  //   if (!location.state) navigate(PATH.ROOT);
  // }, [location]);

  return (
    <>
      <div className="flex flex-col items-center gap-3 max-w-[336px] text-center">
        <CheckCircleTwoTone twoToneColor="#52c41a" className="text-5xl mb-3" />
        <div className="w-full">
          <h1 className="text-base font-semibold">Gửi email thành công</h1>
          <p className="text-sm mt-1">
            Đường dẫn đặt lại mật khẩu đã được gửi tới email
            <b> {location?.state?.email}</b> của bạn.
          </p>
        </div>
        <p className="text-sm text-[#CA8C04] font-semibold">
          * Kiểm tra mục spam/quảng cáo nếu không tìm thấy email.
        </p>
      </div>
    </>
  );
};

export default ResetPassword;
