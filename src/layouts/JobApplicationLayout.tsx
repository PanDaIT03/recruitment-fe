import { Flex, Layout } from 'antd';
import { ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document, Fly, Question } from '~/assets/svg';
import Button from '~/components/Button/Button';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { CloseOutlined, ArrowLeftOutlined } = icons;

interface Item {
  bgColor: string;
  icon: ReactNode;
  content: string;
}

const JobApplicationLayout = ({ children }: { children: ReactNode }) => {
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
        <div className="hidden md:col-span-1 md:block">
          <div className="sticky top-[30vh] space-y-6">
            <Button
              displayType="text"
              title="Quay lại trang cá nhân"
              iconBefore={<ArrowLeftOutlined />}
              className="text-base text-[#F15224] hover:underline"
              onClick={() => navigate(PATH.USER_PROFILE)}
            />
            <h1 className="text-3xl font-semibold">Tạo hồ sơ tìm việc</h1>
            <div className="space-y-6">
              {items.map((item) => (
                <Flex gap={24} align="start">
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
        <Flex vertical gap={24} className="col-span-3 md:col-span-2">
          <div className="w-full">{children}</div>
          <Flex gap={12}>
            <Button
              title="Để sau"
              displayType="outline"
              iconBefore={<CloseOutlined />}
              onClick={() => navigate(PATH.USER_PROFILE)}
            />
            <Button
              fill
              title="Tạo hồ sơ"
              className="w-full"
              iconAfter={<Fly />}
            />
          </Flex>
        </Flex>
      </div>
    </Layout>
  );
};

export default JobApplicationLayout;
