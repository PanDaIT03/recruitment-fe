import { useNavigate } from 'react-router-dom';
import { GreaterThan } from '~/assets/svg';
import Button from '~/components/Button/Button';
import useRole from '~/hooks/useRole';
import { useAppSelector } from '~/hooks/useStore';
import { token } from '~/utils/constant';
import PATH from '~/utils/path';

const HomeBanner = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.auth);

  const { isEmployer, isUser } = useRole();

  const handleNavigate = () => {
    if (!token || !currentUser) {
      navigate(PATH.USER_SIGN_UP);
      return;
    }

    isEmployer && navigate(PATH.EMPLOYER_RECRUITMENT_LIST);
    isUser && navigate(PATH.JOB_LIST);
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
