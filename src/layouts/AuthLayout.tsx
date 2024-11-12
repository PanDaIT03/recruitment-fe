import { Col, Flex, Image, Layout, Row } from 'antd';
import { ReactNode, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ACB, ACFC, SamSung, Shopee, VIB, VinMec } from '~/assets/img';
import {
  Community,
  Graduate,
  Link,
  LogoTextColor,
  WelComeBackCat,
} from '~/assets/svg';
import Button from '~/components/Button/Button';
import { useAppDispatch } from '~/hooks/useStore';
import { getAllRoles } from '~/store/thunk/role';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

interface Item {
  bgColor: string;
  icon: ReactNode;
  content: string;
}

const businessItems = [
  {
    key: '1',
    src: ACB,
    width: 48,
  },
  {
    key: '2',
    src: ACFC,
    width: 69,
  },
  {
    key: '3',
    src: SamSung,
    width: 117,
  },
  {
    key: '4',
    src: Shopee,
    width: 88,
  },
  {
    key: '5',
    src: VIB,
    width: 73,
  },
  {
    key: '6',
    src: VinMec,
    width: 64,
  },
];

const items: Item[] = [
  {
    icon: <Link />,
    bgColor: 'bg-purple-600',
    content: 'Kết nối trực hàng ngàn doanh nghiệp và người tìm việc khác.',
  },
  {
    icon: <Community />,
    bgColor: 'bg-orange-600',
    content:
      'Tham gia các buổi workshop online/offline về tìm việc và nghề nghiệp miễn phí.',
  },
  {
    icon: <Graduate />,
    bgColor: 'bg-yellow-600',
    content: 'Chia sẻ và học hỏi kinh nghiệm từ những người tìm việc khác.',
  },
];

const { ArrowLeftOutlined } = icons;

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const containerClass =
    location.pathname === PATH.EMPLOYER_SIGN_UP ? 'max-w-3xl' : 'max-w-sm';

  const childrenClass =
    location.pathname === PATH.EMPLOYER_SIGN_UP
      ? ''
      : 'shadow-md max-w-sm bg-white p-6 border rounded-xl';

  const isSignUpPage = useMemo(
    () => location.pathname === PATH.USER_SIGN_UP,
    [location]
  );

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

  useEffect(() => {
    if (!isSignUpPage) return;
    dispatch(getAllRoles());
  }, [isSignUpPage]);

  return (
    <Layout className="w-full min-h-screen p-8 justify-center items-center">
      <Row
        align="middle"
        justify="center"
        className="flex w-full gap-5 lg:gap-32"
      >
        {isLeftPanelVisible && (
          <div className="max-w-[300px] hidden md:block">
            {!isSignUpPage ? (
              <WelComeBackCat width={300} height={300} />
            ) : (
              <div className="space-y-6">
                <h1 className="text-3xl font-semibold">
                  Bạn đang tìm việc? Để chúng tôi giúp bạn.
                </h1>
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <Flex key={index} gap={24} align="start">
                      <div
                        className={`h-max text-white p-1 mt-1 rounded-md shadow-sm ${item.bgColor}`}
                      >
                        {item.icon}
                      </div>
                      <span className="text-base">{item.content}</span>
                    </Flex>
                  ))}
                </div>
                <div className="space-y-6">
                  <h2 className="text-base font-semibold">
                    Các doanh nghiệp đang tuyển dụng trên Đúng Người Đúng Việc:
                  </h2>
                  <Flex wrap gap={32}>
                    {businessItems.map(({ key, ...others }) => (
                      <Image key={key} preview={false} {...others} />
                    ))}
                  </Flex>
                </div>
              </div>
            )}
          </div>
        )}
        <Col className={`w-full ${containerClass}`}>
          <Flex vertical align="center" gap={24}>
            <LogoTextColor width={152} height={38} />
            <div className={`flex w-full flex-col gap-y-6 ${childrenClass}`}>
              {children}
            </div>
            <div className="w-full flex justify-center mt-6">
              <Button
                displayType="text"
                title="Quay lại trang chủ"
                iconBefore={<ArrowLeftOutlined />}
                className="text-[#2563eb] hover:underline hover:text-[#2563eb] font-semibold"
                onClick={() => navigate(PATH.ROOT)}
              />
            </div>
          </Flex>
        </Col>
      </Row>
    </Layout>
  );
};

export default AuthLayout;
