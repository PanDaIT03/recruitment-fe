import { Form, Space } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useEffect, useMemo, useState } from 'react';

import { JobsAPI } from '~/apis/job';
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
import { useAppSelector } from '~/hooks/useStore';
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
  placementsId?: number; // delete prop
  placementIds?: number | string;
  workTypesId?: number;
  title?: string;
  jobsId?: number;
  salaryRange?: any;
  type?: string;
  statusId?: number;
}

type IFilter = Omit<IJobList, 'page' | 'pageSize'>;

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

  const { pageInfo, handlePageChange } = usePagination<JobItem, IJobList>({
    items: allJobs?.items,
    extraParams: filters,
    fetchAction: getAllJobs,
    setFilterParams: setFilters,
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

    handlePageChange(1);
    setFilters({ ...cleanedFilters, ...defaultFilter });
  };

  const resetFilters = () => {
    form.resetFields();
    handlePageChange(1);
    setFilters({ ...defaultFilter });
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
        title="Lọc tin"
        open={isOpenDrawer}
        onCancel={resetFilters}
        onFilter={handleFilterSubmit}
        setIsOpenDrawer={setIsOpenDrawer}
      >
        <FormItem label="Lĩnh vực" name="jobFieldsId">
          <Select options={jobFieldsOptions} className="w-full h-10" />
        </FormItem>
        <FormItem name="workTypesId" label="Hình thức làm việc">
          <RadioGroup className="flex flex-col gap-4">
            {workTypes?.data?.items.map?.((type) => (
              <Radio value={type.id} key={type.id}>
                {type.title}
              </Radio>
            ))}
          </RadioGroup>
        </FormItem>
        <FormItem name="categoriesId" label="Loại công việc">
          <RadioGroup className="flex flex-col gap-4">
            {jobCategories?.data?.items.map?.((category) => (
              <Radio value={category.id} key={category.id}>
                {category.name}
              </Radio>
            ))}
          </RadioGroup>
        </FormItem>
        <FormItem name="salaryRange" label="Tất cả mức lương">
          <RadioGroup className="flex flex-col gap-4">
            {salaryOptions.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
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
