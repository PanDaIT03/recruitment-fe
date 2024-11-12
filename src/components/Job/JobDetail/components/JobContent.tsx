import React from 'react';
import { Card, Divider } from 'antd';
import icons from '~/utils/icons';
import { formatCurrencyVN } from '~/utils/functions';

const {
  AppstoreOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  LaptopOutlined,
  TeamOutlined,
} = icons;

const JobInfoCard = ({
  label,
  icon,
  value,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
}) => (
  <div className="flex flex-col md:flex-row items-start md:items-center">
    {icon}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

interface JobContentProps {
  currentJob: any;
}

const JobContent: React.FC<JobContentProps> = ({ currentJob }) => {
  return (
    <Card className="shadow-md w-full">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">
        Chi tiết tin tuyển dụng
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6 bg-purple-100 rounded-md p-4">
        <JobInfoCard
          label="Địa điểm"
          icon={
            <EnvironmentOutlined className="text-2xl mb-1 md:mb-0 md:mr-2 text-purple-600" />
          }
          value={currentJob?.jobsPlacements
            ?.map((place: any) => place?.placement?.title)
            .join(' - ')}
        />
        <JobInfoCard
          label="Mức lương"
          icon={
            <DollarCircleOutlined className="text-2xl mb-1 md:mb-0 md:mr-2 text-purple-600" />
          }
          value={
            currentJob?.salaryMin && currentJob?.salaryMax
              ? `${formatCurrencyVN(Number(currentJob?.salaryMin))} - ${formatCurrencyVN(Number(currentJob?.salaryMax))}`
              : 'Thương lượng'
          }
        />
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <LaptopOutlined className="text-2xl mb-1 md:mb-0 md:mr-2 text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Hình thức làm việc</p>
            <p className="font-medium">{currentJob?.workType?.title}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <ClockCircleOutlined className="text-2xl mb-1 md:mb-0 md:mr-2 text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Loại công việc</p>
            <p className="font-medium">{currentJob?.jobCategory?.name}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <AppstoreOutlined className="text-2xl mb-1 md:mb-0 md:mr-2 text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Kinh nghiệm</p>
            <p className="font-medium">
              {currentJob?.minExpYearRequired && currentJob?.maxExpYearRequired
                ? `${currentJob?.minExpYearRequired} - ${currentJob?.maxExpYearRequired} năm`
                : 'Không yêu cầu'}
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <TeamOutlined className="text-2xl mb-1 md:mb-0 md:mr-2 text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Số lượng</p>
            <p className="font-medium">{currentJob?.quantity}</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
        <InfoCircleOutlined className="text-blue-500 mr-2" />
        <span className="text-blue-700">
          Tin tuyển dụng này đang nhận hồ sơ ứng tuyển...
        </span>
      </div>

      <Divider />

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">Mô tả công việc</h2>
        <div dangerouslySetInnerHTML={{ __html: currentJob?.description }} />
      </section>

      <Divider />

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">Yêu cầu công việc</h2>
        <div dangerouslySetInnerHTML={{ __html: currentJob?.requirements }} />
      </section>

      <Divider />

      <section>
        <h2 className="text-xl font-bold mb-2">Quyền lợi</h2>
        <div dangerouslySetInnerHTML={{ __html: currentJob?.benefits }} />
      </section>
    </Card>
  );
};

export default JobContent;
