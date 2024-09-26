import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { resetEmailStatus } from '~/store/reducer/auth';

const Home = () => {
  const dispatch = useAppDispatch();
  const { emailStatus } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (emailStatus?.statusCode) return;
    dispatch(resetEmailStatus());
  }, []);

  return <div className="min-h-screen">Home</div>;
};

export default Home;
