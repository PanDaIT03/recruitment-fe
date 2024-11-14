import { Flex, Space } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

import Button from '~/components/Button/Button';
import { IJobSeeker } from '~/types/JobSeeker/JobSeeker';
import icons from '~/utils/icons';

interface IProps {
  data: IJobSeeker;
  className?: string;
  onDownLoadProfile?: () => void;
}

const { EnvironmentOutlined, ClockCircleOutlined, DownloadOutlined } = icons;

const CandidateInfo = ({ data, className, onDownLoadProfile }: IProps) => {
  const customClass = classNames('w-full', className);

  return (
    <Space direction="vertical" size="large" className={customClass}>
      <div className="font-medium">
        <p>{data.name}</p>
        <div className="text-gray-500 text-sm">
          Được chia sẻ vào {data.timePosted}
        </div>
      </div>
      <Flex wrap vertical className="text-gray-500" gap={8}>
        <div>
          <EnvironmentOutlined className="mr-1" />
          <span>{data.location}</span>
        </div>
        <div>
          <ClockCircleOutlined className="mr-1" />
          <span>{data.age} tuổi</span>
        </div>
      </Flex>
      {onDownLoadProfile && (
        <Button
          fill
          title="Tải hồ sơ"
          className="w-full"
          iconBefore={<DownloadOutlined width={16} height={16} />}
          onClick={onDownLoadProfile}
        />
      )}
    </Space>
  );
};

export default memo(CandidateInfo);
