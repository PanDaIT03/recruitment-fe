import { Col, Layout, Row, Typography } from 'antd';
import { ReactNode, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import icons from '~/utils/icons';
import PATH from '~/utils/path';
import Button from '../Button/Button';

const { ArrowLeftOutlined } = icons;
const { Title, Paragraph } = Typography;

interface IProps {
  title: ReactNode;
  subTitle: ReactNode;
  children: ReactNode;
}

const AuthWrapper = ({ title, subTitle, children }: IProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLeftPanelHidden = useMemo(() => {
    return location.pathname === PATH.FORGOT_PASSWORD || PATH.RESET_PASSWORD;
  }, [location]);

  return (
    <Layout className="w-full min-h-screen p-8 justify-center items-center">
      <Row justify={'center'} align={'middle'} className="flex gap-x-32">
        {!isLeftPanelHidden && (
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
        <Col>
          <div className="flex flex-col gap-y-6 bg-white p-6 border rounded-xl shadow-md">
            <div className="w-full">
              {typeof title === 'string' ? (
                <h1 className="text-base font-semibold">{title}</h1>
              ) : (
                title
              )}
              {typeof subTitle === 'string' ? (
                <p className="text-sm text-sub mt-1 max-w-[336px]">
                  {subTitle}
                </p>
              ) : (
                subTitle
              )}
            </div>
            {children}
          </div>
          <div className="w-full flex justify-center mt-6">
            <Button
              displayType="text"
              title="Quay lại trang chủ"
              iconBefore={<ArrowLeftOutlined />}
              className="text-[#2563eb] hover:underline hover:text-[#2563eb]"
              onClick={() => navigate(PATH.ROOT)}
            />
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

export default AuthWrapper;
