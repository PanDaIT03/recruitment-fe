import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { resetEmailStatus } from '~/store/reducer/auth';
import HomeBanner from './Banner/HomeBanner';
import BannerImage from './Banner/BannerImage';

const Home = () => {
  const dispatch = useAppDispatch();
  const { emailStatus } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!emailStatus?.statusCode) return;
    dispatch(resetEmailStatus());
  }, [dispatch, emailStatus]);

  return (
    <div className="min-h-screen">
      <div className="min-w-full bg-secondary py-16">
        <div className="px-8 lg:mx-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <HomeBanner />
          <BannerImage />
        </div>
      </div>
    </div>
  );
};

export default Home;
