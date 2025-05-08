import { Space } from 'antd';
import { memo } from 'react';
import { JobItem } from '~/types/Job';

type IProps = Pick<JobItem, 'description' | 'requirements' | 'benefits'>;

const JobDescription = (props: IProps) => {
  const orderedKeys: (keyof IProps)[] = [
    'description',
    'requirements',
    'benefits',
  ];

  const handleRenderTitle = (key: string) => {
    let title = '';

    switch (key) {
      case 'description':
        title = 'Mô tả công việc';
        break;
      case 'requirements':
        title = 'Yêu cầu công việc';
        break;
      default:
        title = 'Tại sao bạn yêu thích làm việc tại đây';
        break;
    }

    return title;
  };

  return (
    <Space direction="vertical" size="large" className="w-full">
      {orderedKeys.map((key, index) => (
        <div key={index}>
          <h2 className="text-2xl font-bold">{handleRenderTitle(key)}</h2>
          <div
            className="text-base ml-6"
            dangerouslySetInnerHTML={{ __html: props[key] }}
          />
        </div>
      ))}
    </Space>
  );
};

export default memo(JobDescription);
