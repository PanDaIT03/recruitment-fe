import { List, Pagination } from 'antd';
import React from 'react';
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
  statusCode: number;
  pageInfo: PageInfo;
  items: JobPosting[];
}

const RecruitmentList: React.FC<JobPostingListProps> = ({}) => {
  const { data: allJobsForEmp, isLoading } = useFetch<JobPostingListProps>(
    ['allJobsForEmp'],
    JobsAPI.getAllJobsForEmployer
  );

  return (
    <div className="space-y-4 text-sm">
      <List
        itemLayout="vertical"
        dataSource={allJobsForEmp?.items}
        loading={isLoading}
        renderItem={(item) => (
          <List.Item className="mb-4">
            <JobListItem item={item} />
          </List.Item>
        )}
        pagination={false}
      />

      {allJobsForEmp && allJobsForEmp?.pageInfo?.totalPages > 1 && (
        <div className="flex justify-end">
          <Pagination
            current={allJobsForEmp?.pageInfo.currentPage}
            total={allJobsForEmp?.pageInfo.totalItems}
            pageSize={allJobsForEmp?.pageInfo.itemsPerPage}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default RecruitmentList;
