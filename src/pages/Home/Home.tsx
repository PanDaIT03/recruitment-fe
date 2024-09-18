import { useEffect } from 'react';
import JobListPage from '~/components/Job/JobList';
import { useAppSelector } from '~/hooks/useStore';

const Home = () => {
  const { currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {}, [currentUser]);

  return (
    <div>
      <JobListPage />
    </div>
  );
};

export default Home;
