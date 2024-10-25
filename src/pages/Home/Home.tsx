import { useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { resetEmailStatus } from '~/store/reducer/auth';
import { getMe } from '~/store/thunk/auth';

const Home = () => {
  const flagRef = useRef(false);
  const dispatch = useAppDispatch();

  const { emailStatus } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!emailStatus?.statusCode) return;
    dispatch(resetEmailStatus());
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token1');
    if (!token) return;

    if (!flagRef.current) {
      dispatch(getMe());
      flagRef.current = true;
    }
  }, []);

  return <div className="min-h-screen">Home</div>;
};

export default Home;
