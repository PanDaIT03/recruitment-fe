import { Tag as AntdTag, Flex } from 'antd';
import { TagProps } from 'antd/lib';
import classNames from 'classnames';
import { memo } from 'react';

import { BackPack, Box, Salary, Television, Users } from '~/assets/svg';
import { JobItem } from '~/types/Job';
import icons from '~/utils/icons';

type IProps = Pick<
  JobItem,
  'jobPosition' | 'jobField' | 'jobCategory' | 'workType' | 'quantity'
> & {
  salary: string;
};

const Tag = ({ className, ...props }: TagProps) => {
  const customClass = classNames(
    'flex items-center text-sm px-2 py-1 rounded-md gap-2',
    '[&>span]:!m-0',
    className
  );

  return <AntdTag className={customClass} {...props} />;
};

const { ClockCircleOutlined } = icons;

const JobTag = ({
  salary,
  jobField,
  workType,
  quantity,
  jobPosition,
  jobCategory,
}: IProps) => (
  <Flex wrap gap={8}>
    <Tag icon={<Salary />} color="volcano">
      {salary}
    </Tag>
    <Tag icon={<BackPack />} color="green">
      {jobPosition.title}
    </Tag>
    <Tag icon={<Box />} color="purple">
      {jobField.title}
    </Tag>
    <Tag icon={<ClockCircleOutlined />} color="cyan">
      {jobCategory.name}
    </Tag>
    <Tag icon={<Television />} color="blue">
      {workType.title}
    </Tag>
    <Tag icon={<Users width={16} height={16} />} color="magenta">
      {quantity}
    </Tag>
  </Flex>
);

export default memo(JobTag);
