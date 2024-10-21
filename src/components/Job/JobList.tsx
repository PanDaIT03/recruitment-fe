import { List } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useMemo, useState } from 'react';
import { JobsAPI } from '~/apis/job';
import { Box, File, Salary, Television } from '~/assets/svg';
import { useFetch } from '~/hooks/useFetch';
import usePagination from '~/hooks/usePagination';
import { useAppSelector } from '~/hooks/useStore';
import { getAllJobs } from '~/store/thunk/job';
import {
  JobItem,
  PaginatedJobCategories,
  PaginatedJobFields,
  PaginatedWorkTypes,
} from '~/types/Job';
import FormItem from '../Form/FormItem';
import CustomSelect from '../Select/CustomSelect';
import TopSearchBar from '../TopSearchBar/TopSearchBar';
import JobCard from './JobCard';

export interface IParams {
  page: number;
  pageSize: number;
  salaryMin?: number;
  salariMax?: number;
  categoriesId?: number;
  jobFieldsId?: number;
  placmentsId?: number;
  workTypesId?: number;
  title?: string;
  salaryRange?: any;
}

const optionsSalary: DefaultOptionType[] = [
  {
    label: 'Tất cả mức lương',
    value: 'all',
  },
  {
    label: '1 - 10 triệu',
    value: 'below10',
  },
  {
    label: '10 - 20 triệu',
    value: '10to20',
  },
  {
    label: '20 - 30 triệu ',
    value: '20to30',
  },
  {
    label: 'Trên 30 triệu ',
    value: 'adove30',
  },
];

const JobListPage = () => {
  const { allJobs, loading } = useAppSelector((state) => state.jobs);
  const [filters, setFilters] = useState<
    Partial<Omit<IParams, 'page' | 'pageSize'>>
  >({});

  const { currentPage, itemsPerPage, handlePageChange } = usePagination<
    JobItem,
    IParams
  >({
    fetchAction: getAllJobs,
    pageInfo: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: allJobs?.pageInfo?.totalItems || 0,
    },
    items: allJobs?.items,
    extraParams: filters,
  });

  const { data: jobCategories } = useFetch<PaginatedJobCategories>(
    JobsAPI.getAllJobCategories
  );
  const { data: workType } = useFetch<PaginatedWorkTypes>(
    JobsAPI.getAllWorkTypes
  );
  const { data: jobFields } = useFetch<PaginatedJobFields>(
    JobsAPI.getAllJobFields
  );

  const jobCategoriesOptions = useMemo(
    () => [
      { label: 'Tất cả loại hình', value: 'all' },
      ...(jobCategories?.items?.map((item) => ({
        label: item.name,
        value: item.id,
      })) || []),
    ],
    [jobCategories]
  );

  const workTypeOptions = useMemo(
    () => [
      { label: 'Tất cả hình thức', value: 'all' },
      ...(workType?.items?.map((item) => ({
        label: item.title,
        value: item.id,
      })) || []),
    ],
    [workType]
  );

  const jobFieldsOptions = useMemo(
    () => [
      { label: 'Tất cả lĩnh vực', value: 'all' },
      ...(jobFields?.items?.map((item) => ({
        label: item.title,
        value: item.id,
      })) || []),
    ],
    [jobFields]
  );

  const handleSearch = (values: IParams) => {
    let salaryMin: number | undefined;
    let salaryMax: number | undefined;

    switch (values.salaryRange) {
      case 'below10':
        salaryMin = 1000000;
        salaryMax = 10000000;
        break;
      case '10to20':
        salaryMin = 10000000;
        salaryMax = 20000000;
        break;
      case '20to30':
        salaryMin = 20000000;
        salaryMax = 30000000;
        break;
      case 'above30':
        salaryMin = 30000000;
        break;
      default:
        break;
    }

    const { salaryRange, ...valuesWithoutSalaryRange } = values;

    const cleanedFilters = Object.fromEntries(
      Object.entries({
        ...valuesWithoutSalaryRange,
        salaryMin,
        salaryMax,
      }).filter(([_, value]) => value && value !== 'all')
    ) as Partial<IParams>;

    setFilters(cleanedFilters);
    handlePageChange(1);
  };

  const handleFilterChange = (values: IParams) => {
    handleSearch(values);
  };

  return (
    <div className="w-full">
      <TopSearchBar
        onSearch={handleFilterChange}
        placeHolder="Vị trí công việc/tên công ty"
      >
        <FormItem
          childrenSelected
          name="workTypesId"
          className="w-full h-10 max-w-44 mb-0"
        >
          <CustomSelect
            showSearch={false}
            displayedType="text"
            className="w-full h-full"
            options={workTypeOptions}
            prefixIcon={<Television />}
          />
        </FormItem>
        <FormItem
          childrenSelected
          name="categoriesId"
          className="w-full max-w-44 mb-0"
        >
          <CustomSelect
            showSearch={false}
            displayedType="text"
            className="w-full h-full"
            options={jobCategoriesOptions}
            prefixIcon={<File />}
          />
        </FormItem>
        <FormItem
          childrenSelected
          name="salaryRange"
          className="w-full max-w-44 mb-0"
        >
          <CustomSelect
            showSearch={false}
            displayedType="text"
            options={optionsSalary}
            prefixIcon={<Salary />}
            className="w-full h-full font-semibold"
          />
        </FormItem>
        <FormItem
          childrenSelected
          name="jobFieldsId"
          className="w-full max-w-44 mb-0"
        >
          <CustomSelect
            showSearch={false}
            displayedType="text"
            className="w-full h-full"
            options={jobFieldsOptions}
            prefixIcon={<Box />}
          />
        </FormItem>
      </TopSearchBar>
      <div className="container mx-auto p-4">
        <div>
          <h2 className="text-base font-medium">Tin tuyển dụng</h2>
          <div className="text-sm text-sub">
            Tìm thấy
            <strong className="text-primary"> {allJobs?.items?.length} </strong>
            tin tuyển dụng
          </div>
        </div>
        <List
          loading={loading}
          itemLayout="vertical"
          dataSource={allJobs?.items}
          renderItem={(job) => (
            <List.Item className="mb-4">
              <JobCard {...job} />
            </List.Item>
          )}
          pagination={
            allJobs && allJobs?.items?.length
              ? {
                  current: currentPage,
                  pageSize: itemsPerPage,
                  total: allJobs?.pageInfo?.totalItems,
                  onChange: handlePageChange,
                  showSizeChanger: false,
                }
              : false
          }
        />
      </div>
    </div>
  );
};

export default JobListPage;
