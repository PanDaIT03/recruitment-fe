import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { Col, Divider, Layout, Row, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';
import Button from '~/components/Button/Button';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { IBaseUser } from '~/types/Auth';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import FormSignIn from './FormSignIn';
import { signIn, signInWithGoogle } from '~/store/thunk/auth';

const { ArrowLeftOutlined } = icons;
const { Title, Paragraph } = Typography;

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [form] = useForm<IBaseUser>();

  // const user = useAppSelector((state) => state.auth);

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);

  const handleSignIn = async (values: any) => {
    const { userName, password } = values;
    dispatch(signIn({ userName: userName, password: password }));
  };

  const handleSignInWithGoogleSuccess = (response: CredentialResponse) => {
    try {
      const token = response.credential;
      if (!token) return;

      const decodedToken: any = jwtDecode(token);
      dispatch(signInWithGoogle(decodedToken));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout className="w-full h-[100vh] px-8 justify-center items-center">
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
        <Col>
          <div className="flex flex-col gap-y-6 bg-white p-6 border rounded-xl shadow-md">
            <div className="w-full">
              <h1 className="text-base font-semibold">
                Đăng nhập cho Người tìm việc
              </h1>
              <p className="text-sm text-sub mt-1">
                Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục
              </p>
            </div>
            <div className="flex w-full justify-center">
              <GoogleLogin onSuccess={handleSignInWithGoogleSuccess} />
            </div>
            <Divider className="!my-0">
              <p className="text-sub text-sm">hoặc</p>
            </Divider>
            <FormSignIn form={form} onFinish={handleSignIn} />
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

export default SignIn;
