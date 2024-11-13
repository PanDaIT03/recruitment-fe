import { Flex, Space, Tag } from 'antd';
import { memo, ReactNode, useState } from 'react';

import Button from '~/components/Button/Button';
import { IJobSeeker } from '~/types/JobSeeker/JobSeeker';
import { formatCurrencyVN } from '~/utils/functions';

interface IProps {
  keys: string[];
  data: IJobSeeker;
}

const Experience = ({ keys, data }: IProps) => {
  const [isSalaryVisible, setIsSalaryVisible] = useState(false);

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
        content =
          value?.length &&
          value?.map((item: string) => <Tag color="green">{item}</Tag>);
        break;
      case 'experience':
        content = value;
        title = 'Số năm kinh nghiệm';
        break;
      case 'salary':
        title = 'Mức lương kỳ vọng';
        content = isSalaryVisible ? (
          <Flex gap={8}>
            <span>{formatCurrencyVN(value)} VND</span>
            <Button
              title="Đóng"
              displayType="text"
              className="text-[#3e8ff3] font-medium leading-6 hover:underline hover:text-[#2d67c5]"
              onClick={() => setIsSalaryVisible(false)}
            />
          </Flex>
        ) : (
          <Button
            displayType="text"
            title="Xem mức lương"
            className="text-[#3e8ff3] font-medium leading-6 hover:underline hover:text-[#2d67c5]"
            onClick={() => setIsSalaryVisible(true)}
          />
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
    <Space direction="vertical" size="middle">
      {experience.map(([key, value]) => {
        const { title, content } = handleRenderTitle(key, value);

        return (
          <Flex className="font-medium leading-6">
            <div className="text-gray-500 flex-shrink-0 min-w-[150px]">
              {title}
            </div>
            <Space direction="vertical">{content}</Space>
          </Flex>
        );
      })}
    </Space>
  );
};

export default memo(Experience);
