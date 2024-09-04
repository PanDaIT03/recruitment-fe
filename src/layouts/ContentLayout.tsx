import { Layout } from 'antd';
import { ReactNode } from 'react';

const ContentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Layout className="min-h-screen">
      <div className="bg-main">{children}</div>
    </Layout>
  );
};

export default ContentLayout;
