import { memo } from 'react';
import { useAppSelector } from '~/hooks/useStore';

const JobCard = () => {
  const allJobs = useAppSelector((state) => state.jobs.allJobs);

  return <div>{allJobs.map((job) => job.user.fullName)}</div>;
};

export default memo(JobCard);
