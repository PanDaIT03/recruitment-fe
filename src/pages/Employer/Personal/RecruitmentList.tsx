import { List, Pagination } from 'antd';
import { JobsAPI } from '~/apis/job';
import { useFetch } from '~/hooks/useFetch';
import JobListItem from './components/JobListItem';

export interface JobPosting {
  id: number;
  jobTitle: string;
  jobCreateAt: string;
  jobSalaryMin: number | null;
  jobSalaryMax: number | null;
  jobQuantity: number;
  userFullName: string;
  workTypeTitle: string;
  jobstatus: string;
  jobCategoryName: string;
  evaluatingCount: string;
  offeringCount: string;
  interviewingCount: string;
  recruitingCount: string;
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface JobPostingListProps {
  statusCode?: number;
  pageInfo?: PageInfo;
  items?: JobPosting[];
}

const RecruitmentList = () => {
  const {
    data: allJobsForEmp,
    isLoading,
    refetch,
  } = useFetch<JobPostingListProps>(
    ['allJobsForEmp'],
    JobsAPI.getAllJobsForEmployer
  );

  const pageInfo = allJobsForEmp?.pageInfo;
  const hasMultiplePages =
    !!allJobsForEmp?.pageInfo?.totalPages &&
    allJobsForEmp.pageInfo.totalPages > 1;

  return (
    <div className="space-y-4 text-sm">
      <List
        itemLayout="vertical"
        dataSource={allJobsForEmp?.items}
        loading={isLoading}
        renderItem={(item) => (
          <List.Item className="mb-4">
            <JobListItem item={item} refetch={refetch} />
          </List.Item>
        )}
        pagination={false}
      />

      {hasMultiplePages && (
        <div className="flex justify-end">
          <Pagination
            current={pageInfo?.currentPage}
            total={pageInfo?.totalItems}
            pageSize={pageInfo?.itemsPerPage}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default RecruitmentList;
