import { Flex, Space, Tag } from 'antd';
import classNames from 'classnames';
import { memo, ReactNode, useState } from 'react';

import Button from '~/components/Button/Button';
import { IJobSeeker } from '~/types/JobSeeker/JobSeeker';
import { formatCurrencyVN } from '~/utils/functions';

interface IProps {
  keys: string[];
  data: IJobSeeker;
  className?: string;
}

const Experience = ({ keys, data, className }: IProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const customClass = classNames('w-full', className);

  const experience = Object.entries(data).filter(([recordKey]) =>
    keys.some((key) => key === recordKey)
  );

  const handleRenderTitle = (key: string, value: any | any[]) => {
    let title = '',
      content: ReactNode = null;

    switch (key) {
      case 'field':
        content = value;
        title = 'Lĩnh vực';

        break;
      case 'position':
        title = 'Vị trí ứng tuyển';
        content = (
          <div className="flex flex-wrap gap-2 lg:flex-col">
            {value?.length &&
              value?.map((item: string, index: number) => (
                <Tag key={index} color="green" className="w-max m-0">
                  {item}
                </Tag>
              ))}
          </div>
        );

        break;
      case 'experience':
        content = value;
        title = 'Số năm kinh nghiệm';

        break;
      case 'salary':
        title = 'Mức lương kỳ vọng';
        content = (
          <>
            {isVisible && <span>{formatCurrencyVN(value)} VND</span>}
            <Button
              displayType="text"
              title={isVisible ? 'Đóng' : 'Xem mức lương'}
              className="text-[#3e8ff3] font-medium leading-6 hover:underline hover:text-[#2d67c5]"
              onClick={() => setIsVisible(!isVisible)}
            />
          </>
        );

        break;
      default:
        content = value;
        title = 'Thời gian bắt đầu';

        break;
    }

    return { title, content };
  };

  return (
    <Space direction="vertical" size="middle" className={customClass}>
      {experience.map(([key, value]) => {
        const { title, content } = handleRenderTitle(key, value);

        return (
          <Flex key={key} className="font-medium leading-6 max-sm:flex-col">
            <div className="text-gray-500 flex-shrink-0 min-w-[150px]">
              {title}
            </div>
            <div>{content}</div>
          </Flex>
        );
      })}
    </Space>
  );
};

export default memo(Experience);
