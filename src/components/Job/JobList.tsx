import { List } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { JobsAPI } from '~/apis/job';
import { BlockChain, PortFolio } from '~/assets/svg';
import { useFetch } from '~/hooks/useFetch';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getAllJobs } from '~/store/thunk/job';
import {
  PaginatedJobCategories,
  PaginatedJobFields,
  PaginatedWorkTypes,
} from '~/types/Job';
import FormItem from '../Form/FormItem';
import CustomSelect from '../Select/CustomSelect';
import TopSearchBar from '../TopSearchBar/TopSearchBar';
import JobCard from './JobCard';

const optionsExperience: DefaultOptionType[] = [
  {
    label: 'Tất cả mức lương',
    value: 'all',
  },
  {
    label: 'Dưới 10 triệu',
    value: 'less',
  },
  {
    label: '10 - 20 triệu',
    value: 'less than 1 year',
  },
  {
    label: '23 - 30 triệu ',
    value: '1-3 year',
  },
];

const JobListPage = () => {
  const location = useLocation();
  const [keyword, setKeyword] = useState('');
  const dispatch = useAppDispatch();
  const { allJobs, loading } = useAppSelector((state) => state.jobs);

  const { data: jobCategories } = useFetch<PaginatedJobCategories>(
    JobsAPI.getAllJobCategories
  );
  const { data: workType } = useFetch<PaginatedWorkTypes>(
    JobsAPI.getAllWorkTypes
  );
  const { data: jobFields } = useFetch<PaginatedJobFields>(
    JobsAPI.getAllJobFields
  );

  useEffect(() => {
    dispatch(getAllJobs());
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setKeyword(searchParams.get('keyword') || '');
  }, [location]);

  const handleSearch = (values: any) => {
    console.log(values);

    // const searchParams = new URLSearchParams();
    // if (keyword) searchParams.append('keyword', keyword);
    // if (location) searchParams.append('location', location);
    // navigate(`?${searchParams.toString()}`);
  };

  const filteredJobs = allJobs?.items?.filter((job) => {
    const keywordMatch = keyword
      ? job.title.toLowerCase().includes(keyword.toLowerCase())
      : true;
    return keywordMatch;
  });

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

  return (
    <div className="w-full">
      <TopSearchBar onSearch={handleSearch} placeHolder="Vị trí công việc">
        <FormItem
          childrenSelected
          name="field"
          className="w-full h-10 max-w-56 mb-0"
        >
          <CustomSelect
            showSearch={false}
            displayedType="text"
            className="w-full h-full"
            options={workTypeOptions}
            prefixIcon={<BlockChain className="w-5 h-5" />}
          />
        </FormItem>
        <FormItem
          childrenSelected
          name="field"
          className="w-full h-10 max-w-56 mb-0"
        >
          <CustomSelect
            showSearch={false}
            displayedType="text"
            className="w-full h-full"
            options={jobCategoriesOptions}
            prefixIcon={<PortFolio className="w-5 h-5" />}
          />
        </FormItem>
        <FormItem
          childrenSelected
          name="field"
          className="w-full h-10 max-w-56 mb-0"
        >
          <CustomSelect
            showSearch={false}
            displayedType="text"
            className="w-full h-full"
            options={optionsExperience}
            prefixIcon={<BlockChain className="w-5 h-5" />}
          />
        </FormItem>
        <FormItem
          childrenSelected
          name="field"
          className="w-full h-10 max-w-56 mb-0"
        >
          <CustomSelect
            showSearch={false}
            displayedType="text"
            className="w-full h-full"
            options={jobFieldsOptions}
            prefixIcon={<BlockChain className="w-5 h-5" />}
          />
        </FormItem>
      </TopSearchBar>
      <div className="container mx-auto px-4">
        <List
          loading={loading}
          itemLayout="vertical"
          dataSource={filteredJobs}
          renderItem={(job) => (
            <List.Item className="mb-4">
              <JobCard {...job} />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default JobListPage;
