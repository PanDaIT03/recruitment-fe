import { Form, List } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { JobsAPI } from '~/apis/job';
import { Search } from '~/assets/svg';
import CustomSelect from '~/components/Select/CustomSelect';
import { useFetch } from '~/hooks/useFetch';
import icons from '~/utils/icons';
import JobListItem from './components/JobListItem';
import PATH from '~/utils/path';
import useBreadcrumb from '~/hooks/useBreadcrumb';
import { StatusJob } from '~/types/Job';
import { useMemo, useState } from 'react';

const { MoreOutlined } = icons;

export interface JobPosting {
  id: number;
  jobTitle: string;
  jobCreateAt: string;
  jobSalaryMin: number | null;
  jobSalaryMax: number | null;
  jobQuantity: number;
  userFullName: string;
  workTypeTitle: string;
  jobstatus: number;
  status: string;
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

const ManageJob = () => {
  const [form] = useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const customBreadcrumbItems = [
    {
      path: PATH.EMPLOYER_RECRUITMENT_LIST,
      label: 'Công việc',
    },
    {
      path: '',
      label: 'Quản lý',
    },
  ];

  const breadcrumb = useBreadcrumb(customBreadcrumbItems, 'text-white');

  const params = { type: 'Công việc' };

  const { data: allStatusJob } = useFetch<StatusJob>(
    ['getAllStatusJob', params.type],
    () => JobsAPI.getAllStatusJob(params.type)
  );

  const statusJob = useMemo(() => {
    return allStatusJob?.items.map((apply) => ({
      value: apply.id,
      label: apply.title,
    }));
  }, [allStatusJob]);

  const statusId = Form.useWatch('statusId', form);

  const {
    data: allJobsForEmp,
    isLoading,
    refetch,
  } = useFetch<JobPostingListProps>(
    ['allJobsForEmp', statusId, currentPage],
    () =>
      JobsAPI.getAllJobsForEmployer(statusId, {
        page: currentPage,
        pageSize: pageSize,
      })
  );

  return (
    <>
      <div className="bg-secondary border-t border-[#561d59]">
        <p className="px-16 w-full py-2">{breadcrumb}</p>
      </div>
      <div className="flex justify-between px-16 bg-white">
        <div>
          <p className="font-bold mt-4">Danh sách tin</p>
          <p className="text-xs text-gray-500">
            Có {allJobsForEmp?.items?.length} tin được tìm thấy
          </p>
        </div>
        <div className="pt-4">
          <Form
            form={form}
            layout="horizontal"
            className="flex gap-2"
            onValuesChange={() => {
              setCurrentPage(1);
              refetch();
            }}
          >
            <Form.Item name="title">
              <CustomSelect
                prefixIcon={<Search />}
                options={[]}
                placeholder="Chọn tên tin tuyển dụng"
              />
            </Form.Item>
            <Form.Item name="statusId">
              <CustomSelect
                allowClear
                prefixIcon={<MoreOutlined />}
                options={statusJob || []}
                placeholder="Chọn trạng thái"
              />
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="px-16">
        <List
          itemLayout="vertical"
          dataSource={allJobsForEmp?.items}
          loading={isLoading}
          renderItem={(item) => (
            <List.Item className="mb-4">
              <JobListItem item={item} refetch={refetch} />
            </List.Item>
          )}
          pagination={{
            pageSize: allJobsForEmp?.pageInfo?.itemsPerPage || 10,
            current: allJobsForEmp?.pageInfo?.currentPage || 1,
            total: allJobsForEmp?.pageInfo?.totalItems,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
            showSizeChanger: true,
          }}
        />
      </div>
    </>
  );
};

export default ManageJob;
