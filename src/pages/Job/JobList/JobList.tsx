import { Form, Space } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { IPaginationParams, JobsAPI } from '~/apis/job';
import { Box, File, Salary, Television } from '~/assets/svg';
import FormItem from '~/components/Form/FormItem';
import List from '~/components/List/List';
import { Radio, RadioGroup } from '~/components/Radio/Radio';
import DrawerSearch from '~/components/Search/DrawerSearch';
import TopSearchBar from '~/components/Search/TopSearchBar';
import CustomSelect from '~/components/Select/CustomSelect';
import Select from '~/components/Select/Select';
import useDocumentTitle from '~/hooks/useDocumentTitle';
import { useFetch } from '~/hooks/useFetch';
import usePagination from '~/hooks/usePagination';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getAllJobs } from '~/store/thunk/job';
import {
  JobItem,
  PaginatedJobCategories,
  PaginatedJobFields,
  PaginatedWorkTypes,
} from '~/types/Job';
import JobCard from './components/JobList/JobCard/JobCard';

export interface IJobList {
  page: number;
  pageSize: number;
  salaryMin?: number;
  salaryMax?: number;
  categoriesId?: number;
  jobFieldsId?: number;
  placementIds?: number | string;
  workTypesId?: number;
  title?: string;
  jobsId?: number;
  salaryRange?: any;
  type?: string;
  statusId?: number;
}

type IFilter = Omit<IJobList, 'page' | 'pageSize'>;

const paramsKeyId = [
  'categoriesId',
  'jobFieldsId',
  'placementIds',
  'workTypesId',
];

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

const defaultFilter: IFilter = {
  type: 'more',
};

const JobList = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { setDocTitle } = useDocumentTitle();

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [filters, setFilters] = useState<IFilter>(defaultFilter);

  const { allJobs, loading } = useAppSelector((state) => state.jobs);

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

  const { pageInfo, handlePageChange, handleClearURLSearchParams } =
    usePagination<JobItem, IPaginationParams & IJobList>({
      extraParams: filters,
      setFilterParams: setFilters,
      fetchFn: (params) => dispatch(getAllJobs(params)),
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

  useEffect(() => {
    setDocTitle('Tin tuyển dụng | Đúng người đúng việc');
  }, []);

  const handleSearch = useCallback((values: IJobList) => {
    let salaryMin: number | undefined;
    let salaryMax: number | undefined;

    switch (values?.salaryRange) {
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
      }).filter(([_, value]) => value !== 'all')
    ) as Partial<IJobList>;

    setIsOpenDrawer(false);
    setFilters({ ...cleanedFilters, ...defaultFilter });
  }, []);

  const handleResetFilters = useCallback(() => {
    form.resetFields();
    form.setFieldValue('placementIds', 'all');

    handlePageChange(1);
    handleClearURLSearchParams();
    setFilters({ ...defaultFilter });
  }, []);

  return (
    <div className="min-h-[100vh]">
      <TopSearchBar
        form={form}
        onClear={handleResetFilters}
        onPageChange={handlePageChange}
        setIsDrawerSearchOpen={setIsOpenDrawer}
        onSearch={(values) => handleSearch(values)}
        placeHolder="Vị trí công việc/tên công ty"
      >
        <FormItem childrenSelected name="workTypesId" className="w-max mb-0">
          <CustomSelect
            showSearch={false}
            displayedType="text"
            className="w-full h-full"
            options={workTypeOptions}
            prefixIcon={<Television />}
          />
        </FormItem>
        <FormItem childrenSelected name="categoriesId" className="w-max mb-0">
          <CustomSelect
            showSearch={false}
            displayedType="text"
            className="w-full h-full"
            options={jobCategoriesOptions}
            prefixIcon={<File />}
          />
        </FormItem>
        <FormItem childrenSelected name="salaryRange" className="w-max mb-0">
          <CustomSelect
            showSearch={false}
            displayedType="text"
            options={salaryOptions}
            prefixIcon={<Salary />}
            className="w-full h-full font-semibold"
          />
        </FormItem>
        <FormItem childrenSelected name="jobFieldsId" className="w-max mb-0">
          <CustomSelect
            showSearch={false}
            prefixIcon={<Box />}
            displayedType="text"
            options={jobFieldsOptions}
            className="w-full h-full lg:min-w-48"
          />
        </FormItem>
      </TopSearchBar>

      <DrawerSearch
        form={form}
        title="Lọc tin"
        open={isOpenDrawer}
        onCancel={handleResetFilters}
        onFilter={() => form.submit()}
        onPageChange={handlePageChange}
        setIsOpenDrawer={setIsOpenDrawer}
      >
        <FormItem label="Lĩnh vực" name="jobFieldsId">
          <Select options={jobFieldsOptions} className="w-full h-10" />
        </FormItem>
        <FormItem name="workTypesId" label="Hình thức làm việc">
          <RadioGroup className="flex flex-col gap-4">
            {workTypeOptions?.map(({ label, value }) => (
              <Radio value={value} key={value}>
                {label}
              </Radio>
            ))}
          </RadioGroup>
        </FormItem>
        <FormItem name="categoriesId" label="Loại công việc">
          <RadioGroup className="flex flex-col gap-4">
            {jobCategoriesOptions?.map(({ label, value }) => (
              <Radio value={value} key={value}>
                {label}
              </Radio>
            ))}
          </RadioGroup>
        </FormItem>
        <FormItem name="salaryRange" label="Tất cả mức lương">
          <RadioGroup className="flex flex-col gap-4">
            {salaryOptions.map(({ label, value }) => (
              <Radio key={value} value={value}>
                {label}
              </Radio>
            ))}
          </RadioGroup>
        </FormItem>
      </DrawerSearch>

      <Space
        size="middle"
        direction="vertical"
        className="w-full py-4 px-4 lg:px-8"
      >
        <div>
          <h2 className="text-base font-semibold">Tin tuyển dụng</h2>
          <div className="text-sm text-sub font-medium">
            Tìm thấy
            <strong className="text-primary">
              {' '}
              {allJobs?.pageInfo.totalItems}{' '}
            </strong>
            tin tuyển dụng
          </div>
        </div>
        <List
          loading={loading}
          skeletonCount={3}
          itemLayout="vertical"
          dataSource={allJobs?.items}
          renderItem={(item) => (
            <List.Item style={{ borderBlockEnd: 0 }}>
              <JobCard {...item} />
            </List.Item>
          )}
          pagination={{
            showSizeChanger: false,
            current: pageInfo.page,
            pageSize: pageInfo.pageSize,
            total: allJobs?.pageInfo?.totalItems,
            onChange: handlePageChange,
          }}
        />
      </Space>
    </div>
  );
};

export default JobList;
