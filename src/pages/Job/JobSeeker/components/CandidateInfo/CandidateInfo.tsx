import { Flex, Space } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

import Button from '~/components/Button/Button';
import { IApproval } from '~/types/Approval';
import icons from '~/utils/icons';

interface IProps {
  data: IApproval;
  className?: string;
  onDownLoadProfile?: () => void;
}

const { EnvironmentOutlined, ClockCircleOutlined, DownloadOutlined } = icons;

const CandidateInfo = ({ data, className, onDownLoadProfile }: IProps) => {
  const customClass = classNames('w-full', className);

  return (
    <Space direction="vertical" size="large" className={customClass}>
      <div className="font-medium">
        <p>{data?.desiredJobSnapshot?.user?.fullName}</p>
        <div className="text-gray-500 text-sm">
          Được chia sẻ vào {data?.approveAt}
        </div>
      </div>
      <Flex wrap vertical className="text-gray-500" gap={8}>
        <div>
          <EnvironmentOutlined className="mr-1" />
          <span>{data?.desiredJobSnapshot?.user?.placement?.title}</span>
        </div>
        <div>
          <ClockCircleOutlined className="mr-1" />
          <span>{data?.desiredJobSnapshot?.yearOfBirth} tuổi</span>
        </div>
      </Flex>
      {onDownLoadProfile && (
        <Button
          title="Tải hồ sơ"
          borderType="dashed"
          className="w-full"
          iconBefore={<DownloadOutlined width={16} height={16} />}
          onClick={onDownLoadProfile}
        />
      )}
    </Space>
  );
};

export default memo(CandidateInfo);
