import { Alert, Avatar, Divider, Flex, Skeleton, Space } from 'antd';
import { cloneElement, Dispatch, memo, ReactNode, SetStateAction } from 'react';

import {
  Box,
  CompanyLogo,
  ExternalLink,
  File,
  Salary,
  Telephone,
  Television,
  Users,
} from '~/assets/svg';
import Button from '~/components/Button/Button';
import { JobItem } from '~/types/Job';
import icons from '~/utils/icons';
import JobDescription from '../JobDescription/JobDescription';

type IProps = Pick<
  JobItem,
  'quantity' | 'user' | 'description' | 'requirements' | 'benefits'
> & {
  salary: string;
  workType: string;
  jobField: string;
  jobCategory: string;
  placements: string;
  loading?: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
};

interface IJobContentItem {
  title: string;
  val: ReactNode;
}

const { EnvironmentOutlined } = icons;

const JobContentItem = ({ title: key, val }: IJobContentItem) => {
  const handleRenderTitle = () => {
    let title = '',
      icon: ReactNode = <p></p>;

    switch (key) {
      case 'salary':
        title = 'Mức lương';
        icon = <Salary />;

        break;
      case 'placements':
        title = 'Địa điểm';
        icon = <EnvironmentOutlined />;

        break;
      case 'quantity':
        title = 'Cần tuyển';
        icon = <Users />;

        break;
      case 'jobField':
        title = 'Lĩnh vực';
        icon = <Box />;

        break;
      case 'workType':
        title = 'Hình thức làm việc';
        icon = <Television />;

        break;
      default:
        title = 'Loại công việc';
        icon = <File />;

        break;
    }

    return { title, icon };
  };

  const { icon, title } = handleRenderTitle();

  return (
    <Flex align="center" gap={16}>
      <div className="flex aspect-square items-center justify-center rounded-full bg-orange-400 p-2 text-main">
        {cloneElement(icon, {
          with: 20,
          height: 20,
        })}
      </div>
      <div className="text-sm">
        <p className="text-sub font-medium">{title}</p>
        <p className="font-semibold text-accent">{val}</p>
      </div>
    </Flex>
  );
};

const JobContent = ({
  user,
  loading,
  benefits,
  description,
  requirements,
  setIsOpenModal,
  ...props
}: IProps) => {
  console.log(user);

  return (
    <Flex gap={16} justify="space-between" className="max-lg:flex-col">
      <div className="flex-1 bg-white rounded-2xl border">
        <div className="px-6 py-4 border-b">
          <p className="text-base font-semibold">Chi tiết tin tuyển dụng</p>
        </div>
        {loading ? (
          <Skeleton
            title
            active
            className="px-6 py-4"
            paragraph={{ rows: 14 }}
          />
        ) : (
          <Space direction="vertical" size="middle" className="px-6 py-4">
            <Alert
              showIcon
              type="info"
              message={
                <p className="text-sm font-bold text-[#2563EB]">
                  Tin tuyển dụng này được đăng bởi cộng đồng
                </p>
              }
              description={
                <p>
                  Tin tuyển dụng cộng đồng là những tin tuyển dụng được đăng bởi
                  các Doanh nghiệp chưa được xác minh. Bạn vui lòng liên hệ Nhà
                  tuyển dụng để tìm hiểu rõ thông tin trước khi ứng tuyển.
                  <span
                    className="font-medium text-accent cursor-pointer hover:opacity-80"
                    onClick={() => setIsOpenModal(true)}
                  >
                    {' '}
                    Xem thông tin liên hệ tại đây
                  </span>
                </p>
              }
            />
            <div className="space-y-4 bg-orange-50 p-4 rounded-2xl border border-orange-200">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(props).map(([title, value], index) => (
                  <JobContentItem key={index} title={title} val={value} />
                ))}
              </div>
            </div>
            <JobDescription
              benefits={benefits}
              description={description}
              requirements={requirements}
            />
          </Space>
        )}
      </div>

      <Space
        size="middle"
        direction="vertical"
        className="w-full h-max px-6 py-4 bg-white rounded-2xl border lg:w-[24rem]"
      >
        <p className="text-base font-semibold">Được đăng bởi</p>
        <div>
          {loading ? (
            <Skeleton avatar active paragraph={{ rows: 1 }} />
          ) : (
            <Flex gap={16} align="center">
              {user?.avatarUrl ? (
                <Avatar
                  shape="square"
                  src={user?.avatarUrl}
                  className="w-16 h-16"
                />
              ) : (
                <CompanyLogo />
              )}
              <div>
                <p className="text-base font-medium">{user?.companyName}</p>
                <p className="text-yellow-700">{user?.email}</p>
              </div>
            </Flex>
          )}
          <Divider dashed />
          {loading ? (
            <Skeleton title={false} active paragraph={{ rows: 3 }} />
          ) : (
            <Space direction="vertical" className="w-full text-xsm">
              <Flex gap={16}>
                <p className="w-[120px] text-sub font-medium">Tên công ty</p>
                <p className="font-semibold">{user?.companyName}</p>
              </Flex>
              <Flex gap={16}>
                <p className="w-[120px] text-sub font-medium">Lĩnh vực</p>
                <p className="font-semibold">{props.jobField}</p>
              </Flex>
              <Flex gap={16}>
                <p className="w-[120px] text-sub font-medium">Website</p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://${user?.companyUrl}`}
                  className="text-[#3B82F6] hover:text-[#60A5FA]"
                >
                  <Flex align="center">
                    {user?.companyUrl}
                    <ExternalLink />
                  </Flex>
                </a>
              </Flex>
              <Button
                className="w-full"
                iconBefore={<Telephone />}
                title="Xem thông tin liên hệ"
                onClick={() => setIsOpenModal(true)}
              />
            </Space>
          )}
        </div>
      </Space>
    </Flex>
  );
};

export default memo(JobContent);
