import { Spin } from 'antd';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen mt-4 bg-gray-100">
      <Spin size="large" />
    </div>
  );
};

export default Loading;
