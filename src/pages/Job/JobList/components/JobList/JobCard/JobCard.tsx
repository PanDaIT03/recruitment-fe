import { Card, Flex, Space } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import dayjs from 'dayjs';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { Calendar } from '~/assets/svg';
import Button from '~/components/Button/Button';
import { JobItem } from '~/types/Job';
import icons from '~/utils/icons';
import JobHeader from '../JobHeader/JobHeader';
import JobTag from '../JobTag/JobTag';

const { ArrowRightOutlined } = icons;

const JobCard = (job: JobItem) => {
  return (
    <Card
      hoverable
      className="border border-gray-200 hover:border-primary shadow-sm rounded-lg"
    >
      <Flex vertical gap={24}>
        <JobHeader
          id={job.id}
          user={job.user}
          title={job.title}
          jobsPlacements={job.jobsPlacements}
        />
        <Flex vertical gap={12}>
          <JobTag
            jobField={job.jobField}
            workType={job.workType}
            quantity={job.quantity}
            jobPosition={job.jobPosition}
            jobCategory={job.jobCategory}
          />
          <Paragraph className="text-sm text-sub font-medium line-clamp-2">
            <ul
              className="list-none"
              dangerouslySetInnerHTML={{ __html: job?.description }}
            ></ul>
          </Paragraph>
          <Flex align="center" justify="space-between" className="font-medium">
            <Space className="text-sub text-sm">
              <Calendar />
              <span>{dayjs(job.createAt).format('DD/MM/YYYY')}</span>
            </Space>
            <Link to={`/job/${job.id}`} target="_blank">
              <Button
                displayType="text"
                title="Xem chi tiết"
                iconAfter={<ArrowRightOutlined />}
                className="font-medium text-base text-[#2563eb] hover:underline hover:text-[#2563eb]"
              />
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default memo(JobCard);
