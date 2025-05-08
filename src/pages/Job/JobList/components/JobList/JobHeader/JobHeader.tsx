import { Avatar, Flex, Typography } from 'antd';
import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { CompanyLogo } from '~/assets/svg';
import { JobItem } from '~/types/Job';

type IProps = Pick<JobItem, 'id' | 'title' | 'user' | 'jobsPlacements'>;

const JobHeader = ({ id, title, user, jobsPlacements }: IProps) => {
  const placements = useMemo(
    () =>
      jobsPlacements
        ?.map((jobPlacement) => jobPlacement?.placement?.title)
        .join(', '),
    [jobsPlacements]
  );

  return (
    <Flex wrap gap={16}>
      {user?.avatarUrl ? (
        <Avatar
          alt={title}
          size="large"
          shape="square"
          src={user.avatarUrl}
          className="w-[72px] h-[72px] rounded-md object-contain"
        />
      ) : (
        <CompanyLogo />
      )}
      <div>
        <Link
          target="_blank"
          to={`/job/${id}`}
          className="text-lg font-semibold hover:underline hover:text-[#000000E0]"
        >
          {title}
        </Link>
        <Typography className="text-sm font-medium">
          {user?.companyName}
        </Typography>
        <Typography className="text-sm text-sub font-medium">
          {placements}
        </Typography>
      </div>
    </Flex>
  );
};

export default memo(JobHeader);
