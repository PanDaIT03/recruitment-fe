import { Divider, Drawer, Form, List, Radio } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useMemo, useState } from 'react';
import { JobsAPI } from '~/apis/job';
import { Box, File, Location, Salary, Television } from '~/assets/svg';
import { useFetch } from '~/hooks/useFetch';
import usePagination from '~/hooks/usePagination';
import { useAppSelector } from '~/hooks/useStore';
import { getAllJobs } from '~/store/thunk/job';
import {
  JobItem,
  JobPlacement,
  PaginatedJobCategories,
  PaginatedJobFields,
  PaginatedWorkTypes,
} from '~/types/Job';
import icons from '~/utils/icons';
import Button from '../Button/Button';
import FormItem from '../Form/FormItem';
import CustomSelect from '../Select/CustomSelect';
import TopSearchBar from '../TopSearchBar/TopSearchBar';
import JobCard from './JobCard';

const { FilterOutlined } = icons;

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
  const [form] = Form.useForm();
  const { allJobs, loading } = useAppSelector((state) => state.jobs);
  const [filters, setFilters] = useState<
    Partial<Omit<IParams, 'page' | 'pageSize'>>
  >({});

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const showFilter = () => {
    setIsFilterVisible(true);
  };

  const hideFilter = () => {
    setIsFilterVisible(false);
  };

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

  const { data: placements } = useFetch<JobPlacement, {}>(
    JobsAPI.getAllPlacements,
    {}
  );

  const { data: jobCategories } = useFetch<PaginatedJobCategories, {}>(
    JobsAPI.getAllJobCategories,
    {}
  );
  const { data: workType } = useFetch<PaginatedWorkTypes, {}>(
    JobsAPI.getAllWorkTypes,
    {}
  );
  const { data: jobFields } = useFetch<PaginatedJobFields, {}>(
    JobsAPI.getAllJobFields,
    {}
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

  const handleFilterSubmit = () => {
    form.validateFields().then((values) => {
      handleSearch(values);
    });
  };

  const resetFilters = () => {
    form.resetFields();
    setFilters({});
    handlePageChange(1);
  };

  const FilterContent = () => (
    <>
      <Form.Item label="Địa điểm" layout="vertical">
        <CustomSelect
          allowClear
          className="h-10"
          placeholder="Chọn khu vực"
          prefixIcon={<Location />}
          configProvider={{
            colorBgContainer: 'bg-light-gray',
          }}
          options={
            placements?.items?.map((place) => ({
              value: place?.id,
              label: place?.title,
            })) || []
          }
        />
      </Form.Item>
      <Form.Item label="Lĩnh vực" layout="vertical">
        <CustomSelect
          showSearch={false}
          placeholder="Chọn lĩnh vực"
          displayedType="text"
          className="w-full h-full"
          options={jobFieldsOptions}
          prefixIcon={<Box />}
        />
      </Form.Item>
      <Form.Item name="workTypesId" label="Hình thức làm việc">
        <Radio.Group className="flex flex-col gap-4">
          {workType?.items.map?.((type) => (
            <Radio value={type.id} key={type.id}>
              {type.title}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item name="categoriesId" label="Loại công việc">
        <Radio.Group className="flex flex-col gap-4">
          {jobCategories?.items.map?.((category) => (
            <Radio value={category.id} key={category.id}>
              {category.name}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item name="salaryRange" label="Tất cả mức lương">
        <Radio.Group className="flex flex-col">
          {optionsSalary.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Divider />
      <div className="w-full flex gap-1">
        <Button title="Hủy" onClick={resetFilters} className="w-full" />
        <Button
          title="Lọc"
          onClick={handleFilterSubmit}
          className="w-full"
          fill
        />
      </div>
    </>
  );

  return (
    <div className="w-full">
      <div className="lg:hidden my-4">
        <Button
          title="Lọc"
          onClick={showFilter}
          iconBefore={<FilterOutlined />}
          className="w-full"
        />
        <Drawer
          title="Bộ lọc"
          placement="right"
          onClose={hideFilter}
          visible={isFilterVisible}
          width="80%"
        >
          <Form form={form}>
            <FilterContent />
          </Form>
        </Drawer>
      </div>

      <div className="hidden lg:block">
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
      </div>

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
