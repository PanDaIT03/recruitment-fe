import { Col, Layout, Row, Typography } from 'antd';
import { ReactNode, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '~/components/Button/Button';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { ArrowLeftOutlined } = icons;
const { Title, Paragraph } = Typography;

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLeftPanelVisible = useMemo(() => {
    let isVisible = true;
    const { pathname } = location;

    if (
      pathname === PATH.USER_FORGOT_PASSWORD ||
      pathname === PATH.USER_RESET_PASSWORD
    )
      isVisible = false;

    return isVisible;
  }, [location]);

  const maxWidth =
    location.pathname === PATH.EMPLOYER_SIGN_UP
      ? 'max-w-3xl'
      : 'shadow-md max-w-sm bg-white p-6 border rounded-xl';

  return (
    <Layout className="w-full min-h-screen p-8 justify-center items-center">
      <Row justify={'center'} align={'middle'} className="flex w-full gap-x-32">
        {isLeftPanelVisible && (
          <Col className="flex flex-col justify-center items-start max-w-md">
            <Title level={2} className="text-gray-700 !mb-0">
              Chào mừng đến với
            </Title>
            <Title level={1} className="text-blue-600 !mt-0 mb-4">
              Tuyển dụng ABC
            </Title>
            <Paragraph className="text-lg text-gray-600">
              Nền tảng tìm việc hàng đầu cho sự nghiệp của bạn
            </Paragraph>
          </Col>
        )}
        <Col className={`w-full ${maxWidth}`}>
          <div className="flex w-full flex-col gap-y-6  ">{children}</div>
          <div className="w-full flex justify-center mt-6">
            <Button
              displayType="text"
              title="Quay lại trang chủ"
              iconBefore={<ArrowLeftOutlined />}
              className="text-[#2563eb] hover:underline hover:text-[#2563eb] font-semibold"
              onClick={() => navigate(PATH.ROOT)}
            />
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

export default AuthLayout;
