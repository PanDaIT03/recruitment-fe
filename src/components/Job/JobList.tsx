import { List } from 'antd';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import SearchBar from '../SearchBar/SearchBar';
import JobCard from './JobCard';
import { getAllJobs } from '~/store/thunk/job';

const JobListPage = () => {
  const dispatch = useAppDispatch();

  const handleSearch = (keyword: string, location: string) => {
    console.log('Searching for:', keyword, location);
  };
  const { allJobs } = useAppSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(getAllJobs());
  }, []);

  return (
    <div className="container mx-auto px-4">
      <SearchBar onSearch={handleSearch} />
      <List
        itemLayout="vertical"
        dataSource={allJobs}
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
