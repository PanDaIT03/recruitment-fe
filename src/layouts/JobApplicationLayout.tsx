import { Flex, Layout } from 'antd';
import { ReactNode, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Document, Question } from '~/assets/svg';
import Button from '~/components/Button/Button';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { ArrowLeftOutlined } = icons;

interface Item {
  bgColor: string;
  icon: ReactNode;
  content: string;
}

const JobApplicationLayout = () => {
  const navigate = useNavigate();

  const items: Item[] = useMemo(
    () => [
      {
        icon: <Question />,
        bgColor: 'bg-purple-600',
        content: 'Được tiếp cận bởi hàng ngàn doanh nghiệp đang tuyển dụng.',
      },
      {
        icon: <Document />,
        bgColor: 'bg-orange-600',
        content: 'Nắm được các doanh nghiệp đã tiếp cận hồ sơ của bạn.',
      },
      {
        icon: <Question />,
        bgColor: 'bg-yellow-600',
        content:
          'CV của bạn sẽ được ẩn đi, chỉ những doanh nghiệp đã được xác minh mới có thể tiếp cận.',
      },
    ],
    []
  );

  return (
    <Layout className="w-full min-h-screen p-8 justify-center items-center">
      <div className="w-full mx-auto py-4 grid grid-cols-3 gap-12 max-w-7xl">
        <div className="hidden lg:col-span-1 lg:block">
          <div className="sticky top-[30vh] space-y-6">
            <Button
              displayType="text"
              title="Quay lại trang cá nhân"
              iconBefore={<ArrowLeftOutlined />}
              className="text-base hover:underline"
              onClick={() => navigate(PATH.USER_PROFILE)}
            />
            <h1 className="text-3xl font-semibold">Tạo hồ sơ tìm việc</h1>
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
          </div>
        </div>
        <div className="w-full col-span-3 lg:col-span-2">
          <h1 className="block text-2xl text-center font-semibold mb-4 lg:hidden">Tạo hồ sơ tìm việc</h1>
          <Outlet />
        </div>
      </div>
    </Layout>
  );
};

export default JobApplicationLayout;
