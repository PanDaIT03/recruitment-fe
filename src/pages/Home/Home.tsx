import { useEffect } from 'react';
import { useAppSelector } from '~/hooks/useStore';

const Home = () => {
  const { currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  return <div>Home</div>;
};

export default Home;
