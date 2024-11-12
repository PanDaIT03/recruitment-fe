import React, { useRef, useEffect } from 'react';
import { Avatar, Card, Divider } from 'antd';
import { Link } from 'react-router-dom';
import icons from '~/utils/icons';
import Button from '~/components/Button/Button';

const { TeamOutlined, ExportOutlined } = icons;

interface JobSidebarProps {
  currentJob: any;
  onApply: () => void;
}

const JobSidebar: React.FC<JobSidebarProps> = ({ currentJob, onApply }) => {
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rightColRef.current) {
        const parentRect =
          rightColRef.current.parentElement?.getBoundingClientRect();

        if (parentRect) {
          if (window.scrollY > parentRect.top) {
            rightColRef.current.style.position = 'fixed';
            rightColRef.current.style.top = '65px';
            rightColRef.current.style.width = `${parentRect.width}px`;
          } else {
            rightColRef.current.style.position = 'static';
            rightColRef.current.style.width = '100%';
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Card className="shadow-md w-full" ref={rightColRef}>
      <h2 className="text-lg font-semibold mb-4">
        {currentJob?.user?.fullName}
      </h2>

      <div className="flex items-center mb-4">
        <div className="bg-gray-200 rounded-md mr-3">
          {currentJob?.user?.avatarUrl ? (
            <Avatar
              alt={currentJob?.title}
              src={currentJob?.user.avatarUrl}
              shape="square"
              size="large"
              className="rounded-md object-contain w-full h-full"
            />
          ) : (
            <TeamOutlined />
          )}
        </div>
        <div>
          <p className="font-medium">{currentJob?.user?.companyName}</p>
        </div>
      </div>

      <Divider />

      <div className="space-y-2 mb-4">
        {[
          {
            label: 'Tên công ty :',
            value: currentJob?.user?.companyName,
          },
          {
            label: 'Tình trạng xác minh : ',
            value: 'Chưa được xác minh',
            className: 'text-orange-500',
          },
          { label: 'Lĩnh vực:', value: 'Giáo dục' },
          {
            label: 'Website:',
            value: (
              <Link
                to={currentJob?.user?.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center"
              >
                {currentJob?.user?.companyUrl || 'Không xác định'}
                <ExportOutlined className="ml-1" />
              </Link>
            ),
          },
        ].map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-gray-500">{item.label}</span>
            <span className={item.className}>{item.value}</span>
          </div>
        ))}
      </div>

      <Button
        fill
        title="Ứng tuyển ngay"
        className="w-full"
        onClick={onApply}
      />
    </Card>
  );
};

export default JobSidebar;
