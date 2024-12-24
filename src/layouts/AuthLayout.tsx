import { Col, Flex, Image, Layout, Row } from 'antd';
import classNames from 'classnames';
import { ReactNode, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ACB, ACFC, SamSung, Shopee, VIB, VinMec } from '~/assets/img';
import {
  BackPack,
  Community,
  Graduate,
  Lightning,
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
  title?: string;
  content: string;
}

enum LEFT_PANEL_TYPE {
  SIGN_IN = 'SIGN_IN',
  USER_SIGN_UP = 'USER_SIGN_UP',
  EMPLOYER_SIGN_UP = 'EMPLOYER_SIGN_UP',
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

const userItems: Item[] = [
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

const employerItems: Item[] = [
  {
    icon: <Community />,
    bgColor: 'bg-green-600',
    title: 'Tiếp cận ứng viên chất lượng',
    content: 'Tìm thấy nhân tài phù hợp từ hàng ngàn hồ sơ tìm việc.',
  },
  {
    icon: <BackPack />,
    bgColor: 'bg-orange-600',
    title: 'Đăng tin tuyển dụng miễn phí',
    content: 'Đăng tin không giới hạn, thu hút ứng viên tiềm năng.',
  },
  {
    icon: <Lightning />,
    bgColor: 'bg-yellow-600',
    title: 'Quản lý tuyển dụng hiệu quả',
    content: 'Đơn giản hóa quy trình tuyển dụng với các công cụ dễ sử dụng.',
  },
];

const { ArrowLeftOutlined } = icons;

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const leftPanelType = useMemo(() => {
    let type: LEFT_PANEL_TYPE = LEFT_PANEL_TYPE.SIGN_IN;

    if (location.pathname === PATH.USER_SIGN_UP)
      type = LEFT_PANEL_TYPE.USER_SIGN_UP;
    if (location.pathname === PATH.EMPLOYER_SIGN_UP)
      type = LEFT_PANEL_TYPE.EMPLOYER_SIGN_UP;

    return type;
  }, [location]);

  const leftPanelClass = classNames(
      'max-w-[300px] hidden',
      leftPanelType === LEFT_PANEL_TYPE.EMPLOYER_SIGN_UP
        ? 'h-screen lg:block'
        : 'md:block'
    ),
    containerClass = classNames(
      'w-full',
      location.pathname === PATH.EMPLOYER_SIGN_UP
        ? 'max-w-4xl lg:max-w-xl'
        : 'max-w-sm'
    ),
    childrenClass = classNames(
      'flex w-full flex-col gap-y-6',
      location.pathname === PATH.EMPLOYER_SIGN_UP
        ? ''
        : 'shadow-md max-w-sm bg-white p-6 border rounded-xl'
    );

  const isLeftPanelVisible = useMemo(() => {
    let isVisible = false;
    const { pathname } = location;

    if (
      pathname === PATH.USER_SIGN_IN ||
      pathname === PATH.USER_SIGN_UP ||
      pathname === PATH.EMPLOYER_SIGN_UP
    )
      isVisible = true;

    return isVisible;
  }, [location]);

  useEffect(() => {
    if (
      location.pathname === PATH.USER_SIGN_UP ||
      location.pathname === PATH.EMPLOYER_SIGN_UP
    )
      dispatch(getAllRoles());
  }, [location]);

  return (
    <Layout className="w-full min-h-screen p-8 justify-center items-center">
      <Row
        align="middle"
        justify="center"
        className="flex w-full gap-5 lg:gap-20"
      >
        <Col className={leftPanelClass}>
          {isLeftPanelVisible ? (
            leftPanelType === LEFT_PANEL_TYPE.SIGN_IN ? (
              <WelComeBackCat width={300} height={300} />
            ) : leftPanelType === LEFT_PANEL_TYPE.USER_SIGN_UP ? (
              <div className="space-y-6">
                <h1 className="text-3xl font-semibold">
                  Bạn đang tìm việc? Để chúng tôi giúp bạn.
                </h1>
                <div className="space-y-6">
                  {userItems.map((item, index) => (
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
            ) : (
              <div className="space-y-6 sticky top-[30vh]">
                <h1 className="text-3xl font-semibold">
                  Quyền lợi Nhà tuyển dụng
                </h1>
                <div className="space-y-6">
                  {employerItems.map((item, index) => (
                    <Flex key={index} gap={24} align="start">
                      <div
                        className={`h-max text-white p-1 mt-1 rounded-md shadow-sm ${item.bgColor}`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-lg font-medium">{item.title}</p>
                        <p className="text-xsm text-sub">{item.content}</p>
                      </div>
                    </Flex>
                  ))}
                </div>
              </div>
            )
          ) : (
            <></>
          )}
        </Col>

        <Col className={containerClass}>
          <Flex vertical align="center" gap={24}>
            <LogoTextColor width={152} height={38} />
            <div className={childrenClass}>{children}</div>
            <div className="w-full flex justify-center mt-3">
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
