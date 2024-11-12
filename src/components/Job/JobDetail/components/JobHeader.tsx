import React from 'react';
import Button from '~/components/Button/Button';
import icons from '~/utils/icons';

const { ShareAltOutlined, TeamOutlined } = icons;

interface JobHeaderProps {
  currentJob: any;
  onShare: () => void;
  onApply: () => void;
}

const JobHeader: React.FC<JobHeaderProps> = ({
  currentJob,
  onShare,
  onApply,
}) => {
  return (
    <>
      <Button
        className="w-full md:hidden mb-4"
        iconBefore={<TeamOutlined />}
        title="Ứng tuyển ngay"
        onClick={onApply}
      />
      <div className="mb-4 hidden md:block">
        <h1 className="text-2xl font-bold mb-2">{currentJob?.title}</h1>
        <p className="text-gray-500 mb-4">{currentJob?.user?.companyName}</p>
        <div className="flex flex-wrap gap-2">
          <Button
            iconBefore={<ShareAltOutlined />}
            className="mb-2 sm:mb-0"
            title="Chia sẻ"
            onClick={onShare}
          />
          <Button
            fill
            className="w-full sm:w-auto"
            title="Ứng tuyển ngay"
            onClick={onApply}
          />
        </div>
      </div>
    </>
  );
};

export default JobHeader;
