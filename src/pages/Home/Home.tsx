import { useEffect } from 'react';
import JobCard from '~/components/Job/JobCard';
import { useAppSelector } from '~/hooks/useStore';

const Home = () => {
  const { currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  return (
    <div>
      <JobCard />
    </div>
  );
};

export default Home;
