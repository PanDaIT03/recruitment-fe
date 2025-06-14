import { useMutation } from '@tanstack/react-query';
import { Skeleton, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { JobsAPI } from '~/apis/job';
import { useMessage } from '~/contexts/MessageProvider';
import useBreadcrumb from '~/hooks/useBreadcrumb';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getJobById } from '~/store/thunk/job';
import { formatSalary } from '~/utils/functions';
import PATH from '~/utils/path';
import JobApplyModal from './components/JobDetail/JobApplyModal/JobApplyModal';
import JobContactModal from './components/JobDetail/JobContactModal/JobContactModal';
import JobContent from './components/JobDetail/JobContent/JobContent';
import JobHeader from './components/JobDetail/JobHeader/JobHeader';
import JobShareModal from './components/JobDetail/JobShareModal/JobShareModal';

const JobDetail = () => {
  const { messageApi } = useMessage();
  const dispatch = useAppDispatch();

  const { id } = useParams<{ id: string }>();
  const { currentJob, loading } = useAppSelector((state) => state.jobs);

  const [isOpenShareModal, setIsOpenShareModal] = useState(false);
  const [isOpenContactModal, setIsOpenContactModal] = useState(false);
  const [isOpenJobApplyModal, setIsOpenJobApplyModal] = useState(false);

  const { mutate: applyJob, isPending } = useMutation({
    mutationFn: (params: FormData) => JobsAPI.ApplyJob(params),
    onSuccess: (res) => {
      messageApi.success(res?.message);
      setIsOpenJobApplyModal(false);
    },
    onError: (error: any) => messageApi.error(error?.response?.data?.message),
  });

  const breadcrumb = useBreadcrumb([
    { path: PATH.JOB_LIST, label: 'Tin tuyển dụng' },
    {
      path: `/job/${id}`,
      label: currentJob?.title || 'Chi tiết công việc',
    },
  ]);

  const applicationDeadline = useMemo(
    () =>
      currentJob.applicationDeadline
        ? `${dayjs(currentJob.applicationDeadline).format('DD/MM/YYYY')}`
        : '',
    [currentJob]
  );

  const placements = useMemo(() => {
    if (!currentJob.jobsPlacements || !currentJob.jobsPlacements.length)
      return '';

    return currentJob.jobsPlacements
      .map((jobPlacement) => jobPlacement.placement.title)
      .join(', ');
  }, [currentJob]);

  const jobSalary = useMemo(
    () => formatSalary(currentJob.salaryMin, currentJob.salaryMax),
    [currentJob]
  );

  useEffect(() => {
    dispatch(getJobById(id));
  }, [id]);

  return (
    <div className="px-4 lg:px-8 w-full py-8">
      <div className="mx-auto max-w-7xl">
        <Space direction="vertical" size="large" className="w-full">
          {loading ? (
            <Skeleton active title paragraph={{ rows: 0 }} />
          ) : (
            breadcrumb
          )}
          <JobHeader
            loading={loading}
            salary={jobSalary}
            user={currentJob.user}
            title={currentJob.title}
            placements={placements}
            applicationDeadline={applicationDeadline}
            setIsOpenShareModal={setIsOpenShareModal}
            setIsOpenContactModal={setIsOpenContactModal}
            setIsOpenJobApplyModal={setIsOpenJobApplyModal}
          />
          <JobContent
            loading={loading}
            salary={jobSalary}
            user={currentJob.user}
            placements={placements}
            quantity={currentJob.quantity}
            jobField={currentJob.jobField?.title}
            workType={currentJob.workType?.title}
            jobCategory={currentJob.jobCategory?.name}
            description={currentJob.description}
            requirements={currentJob.requirements}
            benefits={currentJob.benefits}
            setIsOpenModal={setIsOpenContactModal}
          />
        </Space>
      </div>
      <JobContactModal
        data={currentJob.user}
        isOpen={isOpenContactModal}
        onCancel={() => setIsOpenContactModal(false)}
      />
      <JobShareModal
        jobId={currentJob.id}
        isOpen={isOpenShareModal}
        title={`Chia sẻ tin tuyển dụng: ${currentJob.title}`}
        onCancel={() => setIsOpenShareModal(false)}
      />
      <JobApplyModal
        loading={isPending}
        jobId={currentJob.id}
        isOpen={isOpenJobApplyModal}
        title={
          <h2 className="text-base font-semibold">
            Ứng tuyển vị trí:
            <span className="text-accent"> {currentJob.title}</span>
          </h2>
        }
        onApply={(values) => applyJob(values)}
        onCancel={() => setIsOpenJobApplyModal(false)}
      />
    </div>
  );
};

export default JobDetail;
