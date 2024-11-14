import { Form, List, Pagination } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { JobsAPI } from '~/apis/job';
import { Search } from '~/assets/svg';
import CustomSelect from '~/components/Select/CustomSelect';
import { useFetch } from '~/hooks/useFetch';
import icons from '~/utils/icons';
import JobListItem from './components/JobListItem';

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

const ManageJob = () => {
  const [form] = useForm();
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
    <>
      <div className="flex justify-between mt-4">
        <div>
          <p className="font-bold">Danh sách tin</p>
          <p className="text-xs text-gray-500">
            Có {allJobsForEmp?.items?.length} tin được tìm thấy
          </p>
        </div>
        <div>
          <Form form={form} layout="horizontal" className="flex gap-2">
            <Form.Item name="title">
              <CustomSelect
                prefixIcon={<Search />}
                options={[]}
                placeholder="Chọn tên tin tuyển dụng"
              />
            </Form.Item>
            <Form.Item name="status">
              <CustomSelect
                prefixIcon={<MoreOutlined />}
                options={[]}
                placeholder="Chọn trạng thái"
              />
            </Form.Item>
          </Form>
        </div>
      </div>
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
    </>
  );
};

export default ManageJob;
