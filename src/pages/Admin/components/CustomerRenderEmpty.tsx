import { Empty } from 'antd';

import { NoData } from '~/assets/svg';

export const CustomerEmptyData = () => {
  return (
    <Empty
      description={<span className="text-admin-primary">Không có dữ liệu</span>}
      image={<NoData />}
      imageStyle={{ height: '70px' }}
    />
  );
};
