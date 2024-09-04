import { Col, Layout, Row, Typography } from 'antd';
import { ReactNode } from 'react';

const { Title, Paragraph } = Typography;

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Layout className="w-full min-h-screen px-8 justify-center items-center">
      <Row justify={'center'} align={'middle'} className="flex gap-x-32">
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
        <Col>{children}</Col>
      </Row>
    </Layout>
  );
};

export default AuthLayout;
