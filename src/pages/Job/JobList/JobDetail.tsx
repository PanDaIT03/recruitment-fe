import { Space } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import useBreadcrumb from '~/hooks/useBreadcrumb';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getJobById } from '~/store/thunk/job';
import PATH from '~/utils/path';
import JobContent from './components/JobDetail/JobContent/JobContent';
import JobHeader from './components/JobDetail/JobHeader/JobHeader';

const JobDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<{ id: string }>();
  const { currentJob } = useAppSelector((state) => state.jobs);

  const breadcrumb = useBreadcrumb([
    { path: PATH.JOB_LIST, label: 'Tin tuyển dụng' },
    {
      path: `/job/${id}`,
      label: currentJob?.title || 'Chi tiết công việc',
    },
  ]);

  console.log(currentJob);

  useEffect(() => {
    dispatch(getJobById(id));
  }, [id]);

  useEffect(() => {
    if (!Object.keys(currentJob).length) return;
  }, [currentJob]);

  return (
    <div className="w-full mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <Space direction="vertical" size="large" className="w-full">
        {breadcrumb}
        <JobHeader
          title={currentJob.title}
          createAt={currentJob.createAt}
          salaryMax={currentJob.salaryMax}
          salaryMin={currentJob.salaryMin}
          jobsPlacements={currentJob.jobsPlacements}
        />
        <JobContent />
      </Space>
    </div>
  );
};

export default JobDetail;
