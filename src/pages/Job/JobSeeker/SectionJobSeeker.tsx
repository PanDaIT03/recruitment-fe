import { Divider, Space } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

import Button from '~/components/Button/Button';
import { IApproval } from '~/types/Approval';
import icons from '~/utils/icons';
import Achievement from './components/Achievement/Achievement';
import CandidateInfo from './components/CandidateInfo/CandidateInfo';
import Experience from './components/Experience/Experience';

interface IProps {
  data: IApproval[];
  className?: string;
  onDownLoadProfile: () => void;
}

const { DownloadOutlined } = icons;

const SectionJobSeeker = ({ data, className, onDownLoadProfile }: IProps) => {
  const customClass = classNames(
    'bg-white rounded-2xl border border-normal p-6',
    className
  );

  const keys = ['field', 'position', 'experience', 'salary', 'startDate'];

  return (
    <Space direction="vertical" size="middle">
      {data.map((item, index) => (
        <div key={index} className={customClass}>
          <CandidateInfo data={item} />
          <Divider dashed />
          <Experience keys={keys} data={item} />
          <Divider dashed />
          <Achievement value={item.requirements} />
          <Button
            title="Tải hồ sơ"
            borderType="dashed"
            className="w-full mt-8"
            iconBefore={<DownloadOutlined width={16} height={16} />}
            onClick={onDownLoadProfile}
          />
        </div>
      ))}
    </Space>
  );
};

export default memo(SectionJobSeeker);
