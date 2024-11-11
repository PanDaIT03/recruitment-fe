import Button from '~/components/Button/Button';
import { GreaterThan } from '~/assets/svg';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '~/hooks/useStore';
import PATH from '~/utils/path';

const HomeBanner = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token2');
  const { currentUser } = useAppSelector((state) => state.auth);

  const handleNavigate = () => {
    if (!token || !currentUser) {
      navigate(PATH.USER_SIGN_UP);
      return;
    }

    const roleRedirectMap: { [key: number]: string } = {
      13: PATH.JOB_LIST,
      3: PATH.EMPLOYER_DASHBOARD,
    };

    const targetPath = roleRedirectMap[currentUser.role.id];
    if (targetPath) {
      navigate(targetPath);
    }
  };

  return (
    <div className="lg:col-start-1 lg:col-end-3 flex flex-col items-center lg:items-start text-white space-y-6 pt-8">
      <span className="text-lg font-semibold text-center lg:text-left">
        Một dự án cộng đồng
      </span>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center lg:text-left">
        Kết nối miễn phí
        <h1 className="text-[#FF6B4E]">
          ứng viên & doanh <br /> nghiệp
        </h1>
      </h1>
      <p className="text-lg text-center lg:text-left max-w-md">
        Chúng tôi tin rằng, hành trình tìm việc và tuyển dụng nên bắt đầu từ
        việc kết nối và thấu hiểu.
      </p>
      <Button
        title="Đăng ký tìm việc"
        className="mt-4 flex items-center gap-2"
        fill
        iconAfter={<GreaterThan />}
        onClick={handleNavigate}
      />
    </div>
  );
};

export default HomeBanner;
