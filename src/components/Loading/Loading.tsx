import { Spin } from 'antd';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Spin size="large" tip="Loading..." />
    </div>
  );
};

export default Loading;
