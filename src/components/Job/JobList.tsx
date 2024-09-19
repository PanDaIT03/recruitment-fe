import { List } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getAllJobs } from '~/store/thunk/job';
import TopSearchBar from '../TopSearchBar/TopSearchBar';
import JobCard from './JobCard';

const JobListPage = () => {
  const location = useLocation();
  const [keyword, setKeyword] = useState('');
  const dispatch = useAppDispatch();
  const { allJobs, loading } = useAppSelector((state) => state.jobs);

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

  const filteredJobs = allJobs.filter((job) => {
    const keywordMatch = keyword
      ? job.title.toLowerCase().includes(keyword.toLowerCase())
      : true;
    return keywordMatch;
  });

  return (
    <div className="container mx-auto px-4">
      <TopSearchBar onSearch={handleSearch} />
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
  );
};

export default JobListPage;
