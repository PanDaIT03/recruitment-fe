import { Flex, Space } from 'antd';
import dayjs from 'dayjs';
import { memo, useMemo } from 'react';

import { Lightning, Salary } from '~/assets/svg';
import Button from '~/components/Button/Button';
import { JobItem } from '~/types/Job';
import { formatCurrencyVN } from '~/utils/functions';
import icons from '~/utils/icons';

const { EnvironmentOutlined, ClockCircleOutlined, ShareAltOutlined } = icons;

type IProps = Pick<
  JobItem,
  'jobsPlacements' | 'salaryMin' | 'salaryMax' | 'title' | 'createAt'
>;

const JobHeader = ({
  title,
  createAt,
  salaryMin,
  salaryMax,
  jobsPlacements,
}: IProps) => {
  const placements = useMemo(() => {
    if (!jobsPlacements || !jobsPlacements.length) return;

    return jobsPlacements
      .map((jobPlacement) => jobPlacement.placement.title)
      .join(', ');
  }, [jobsPlacements]);

  const jobSalary = useMemo(() => {
    if (!salaryMin || !salaryMax) return 'Thương lương';
    return `${formatCurrencyVN(salaryMin)} - ${formatCurrencyVN(salaryMax)} VND`;
  }, [salaryMin, salaryMax]);

  return (
    <Flex align="center" justify="space-between">
      <Space direction="vertical">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Flex align="center" gap={8}>
          <Flex
            gap={8}
            align="center"
            className="text-sm text-sub font-medium pr-2 border-r h-4 border-neutral-400"
          >
            <EnvironmentOutlined />
            <span>{placements}</span>
          </Flex>
          <Flex
            gap={8}
            align="center"
            className="text-sm text-accent font-medium pr-2 border-r h-4 border-neutral-400"
          >
            <Salary />
            <span>{jobSalary}</span>
          </Flex>
          <Flex gap={8} align="center" className="text-sm text-sub font-medium">
            <ClockCircleOutlined />
            <span>Đăng lúc {dayjs(createAt).format('DD/MM/YYYY HH:mm')}</span>
          </Flex>
        </Flex>
      </Space>
      <Flex align="center" gap={16}>
        <Button
          displayType="text"
          title={<ShareAltOutlined />}
          className="text-accent text-base"
        />
        <Button
          fill
          title="Ứng tuyển ngay"
          iconBefore={<Lightning />}
          className="w-full sm:w-auto"
        />
      </Flex>
    </Flex>
  );
};

export default memo(JobHeader);
