import React from 'react';
import { Row, Col, Card, Statistic, Progress } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const data = [
    { month: 'January', jobPosts: 65 },
    { month: 'February', jobPosts: 59 },
    { month: 'March', jobPosts: 80 },
    { month: 'April', jobPosts: 81 },
    { month: 'May', jobPosts: 56 },
    { month: 'June', jobPosts: 55 },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Row gutter={16}>
        <Col span={8}>
          <Card className="shadow-lg">
            <Statistic
              title="Total Jobs"
              value={1128}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
            <Progress className="mt-4" percent={75} status="active" />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="shadow-lg">
            <Statistic
              title="Applications"
              value={3210}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
            <Progress className="mt-4" percent={50} status="exception" />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="shadow-lg">
            <Statistic title="Active Users" value={1345} />
            <Progress className="mt-4" percent={90} status="active" />
          </Card>
        </Col>
      </Row>
      <div className="mt-8">
        <Card title="Job Post Trend (Monthly)" className="shadow-lg">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="jobPosts" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
