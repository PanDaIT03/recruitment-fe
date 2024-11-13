import { Form, List, Radio } from 'antd';
import Select, { DefaultOptionType } from 'antd/es/select';
import { useMemo, useState } from 'react';

import { JobsAPI } from '~/apis/job';
import { Box, File, Salary, Television } from '~/assets/svg';
import FormItem from '~/components/Form/FormItem';
import JobCard from '~/components/Job/JobCard';
import DrawerSearch from '~/components/Search/DrawerSearch';
import TopSearchBar from '~/components/Search/TopSearchBar';
import CustomSelect from '~/components/Select/CustomSelect';
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

export interface IJobList {
  page: number;
  pageSize: number;
  salaryMin?: number;
  salaryMax?: number;
  categoriesId?: number;
  jobFieldsId?: number;
  placementsId?: number;
  workTypesId?: number;
  title?: string;
  salaryRange?: any;
}

type IFilter = Partial<Omit<IJobList, 'page' | 'pageSize'>>;

const salaryOptions: DefaultOptionType[] = [
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

const JobList = () => {
  const [form] = Form.useForm();
  const { allJobs, loading } = useAppSelector((state) => state.jobs);

  const [filters, setFilters] = useState<IFilter>({});
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const jobCategories = useFetch<PaginatedJobCategories>(
    ['jobCategories'],
    JobsAPI.getAllJobCategories
  );

  const workTypes = useFetch<PaginatedWorkTypes>(
    ['workTypes'],
    JobsAPI.getAllWorkTypes
  );

  const jobFields = useFetch<PaginatedJobFields>(
    ['jobFields'],
    JobsAPI.getAllJobFields
  );

  const { currentPage, itemsPerPage, handlePageChange } = usePagination<
    JobItem,
    IJobList
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

  const jobCategoriesOptions = useMemo(
    () => [
      { label: 'Tất cả loại hình', value: 'all' },
      ...(jobCategories?.data?.items?.map((item) => ({
        label: item.name,
        value: item.id,
      })) || []),
    ],
    [jobCategories]
  );

  const workTypeOptions = useMemo(
    () => [
      { label: 'Tất cả hình thức', value: 'all' },
      ...(workTypes?.data?.items?.map((item) => ({
        label: item.title,
        value: item.id,
      })) || []),
    ],
    [workTypes]
  );

  const jobFieldsOptions = useMemo(
    () => [
      { label: 'Tất cả lĩnh vực', value: 'all' },
      ...(jobFields?.data?.items?.map((item) => ({
        label: item.title,
        value: item.id,
      })) || []),
    ],
    [jobFields]
  );

  const handleSearch = (values: IJobList) => {
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
    ) as Partial<IJobList>;

    setFilters(cleanedFilters);
    handlePageChange(1);
  };

  const resetFilters = () => {
    form.resetFields();
    form.setFieldsValue({
      jobFieldsId: 'all',
      salaryRange: 'all',
    });

    setFilters({});
    handlePageChange(1);
  };

  const handleFilterSubmit = () => {
    form.validateFields().then((values) => {
      handleSearch(values);
    });
  };

  return (
    <div className="min-h-[100vh]">
      <TopSearchBar
        form={form}
        setIsDrawerSearchOpen={setIsOpenDrawer}
        onSearch={(values) => handleSearch(values)}
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
            options={salaryOptions}
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

      <DrawerSearch
        form={form}
        open={isOpenDrawer}
        title="Lọc tin"
        onCancel={resetFilters}
        onFilter={handleFilterSubmit}
        setIsOpenDrawer={setIsOpenDrawer}
      >
        <FormItem label="Lĩnh vực" name="jobFieldsId">
          <Select options={jobFieldsOptions} className="w-full h-10" />
        </FormItem>
        <FormItem name="workTypesId" label="Hình thức làm việc">
          <Radio.Group className="flex flex-col gap-4">
            {workTypes?.data?.items.map?.((type) => (
              <Radio value={type.id} key={type.id}>
                {type.title}
              </Radio>
            ))}
          </Radio.Group>
        </FormItem>
        <FormItem name="categoriesId" label="Loại công việc">
          <Radio.Group className="flex flex-col gap-4">
            {jobCategories?.data?.items.map?.((category) => (
              <Radio value={category.id} key={category.id}>
                {category.name}
              </Radio>
            ))}
          </Radio.Group>
        </FormItem>
        <FormItem name="salaryRange" label="Tất cả mức lương">
          <Radio.Group className="flex flex-col gap-4">
            {salaryOptions.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        </FormItem>
      </DrawerSearch>

      <div className="w-full">
        <div className="container mx-auto p-4">
          <div>
            <h2 className="text-base font-medium">Tin tuyển dụng</h2>
            <div className="text-sm text-sub">
              Tìm thấy
              <strong className="text-primary">
                {' '}
                {allJobs?.items?.length}{' '}
              </strong>
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
    </div>
  );
};

export default JobList;
