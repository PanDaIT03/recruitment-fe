import { List } from 'antd';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import SearchBar from '../SearchBar/SearchBar';
import JobCard from './JobCard';
import { getAllJobs } from '~/store/thunk/job';
import { useLocation, useNavigate } from 'react-router-dom';

const JobListPage = () => {
  const navigate = useNavigate();
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

  const handleSearch = (keyword: string, location: string) => {
    const searchParams = new URLSearchParams();
    if (keyword) searchParams.append('keyword', keyword);
    if (location) searchParams.append('location', location);
    navigate(`?${searchParams.toString()}`);
  };

  const filteredJobs = allJobs.filter((job) => {
    const keywordMatch = keyword
      ? job.title.toLowerCase().includes(keyword.toLowerCase())
      : true;
    return keywordMatch;
  });

  return (
    <div className="container mx-auto px-4">
      <SearchBar onSearch={handleSearch} />
      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={filteredJobs}
        renderItem={(job) => (
          <List.Item className="mb-4">
            <JobCard
              id={job.id}
              createBy={job.createBy}
              createAt={job.createAt}
              updateBy={job.updateBy}
              updateAt={job.updateAt}
              title={job.title}
              startPrice={job.startPrice}
              endPrice={job.endPrice}
              startExpYearRequired={job.startExpYearRequired}
              endExpYearRequired={job.endExpYearRequired}
              applicationDeadline={job.applicationDeadline}
              workTime={job.workTime}
              description={job.description}
              requirement={job.requirement}
              whyLove={job.whyLove}
              user={job.user}
              jobPosition={job.jobPosition}
              jobField={job.jobField}
              jobsPlacements={job.jobsPlacements}
              workType={job.workType}
              jobCategory={job.jobCategory}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default JobListPage;
