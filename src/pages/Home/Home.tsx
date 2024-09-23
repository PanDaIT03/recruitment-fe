import { useEffect } from 'react';
import { useAppSelector } from '~/hooks/useStore';

const Home = () => {
  const { currentUser } = useAppSelector((state) => state.auth);
  useEffect(() => {}, [currentUser]);

  return <div></div>;
};

export default Home;
