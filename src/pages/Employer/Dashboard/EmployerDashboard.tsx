import { Card, Empty } from 'antd';
import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

const data = [
  { month: 'Tháng 1', value: 5 },
  { month: 'Tháng 2', value: 2 },
  { month: 'Tháng 3', value: 10 },
  { month: 'Tháng 4', value: 1 },
  { month: 'Tháng 5', value: 2 },
  { month: 'Tháng 6', value: 1 },
  { month: 'Tháng 7', value: 8 },
  { month: 'Tháng 8', value: 0 },
  { month: 'Tháng 9', value: 0 },
  { month: 'Tháng 10', value: 0 },
  { month: 'Tháng 11', value: 0 },
  { month: 'Tháng 12', value: 0 },
];

const EmployerDashboard: React.FC = () => {
  return (
    <div className="p-4 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <Card
            title="Số lượng ứng tuyển từng tháng"
            className="h-full shadow-md"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <div className="grid gap-1">
          <Card title="Phỏng vấn sắp tới" className="shadow-md">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có cuộc phỏng vấn nào sắp tới"
            />
          </Card>
          <Card title="Ứng viên sắp đi làm" className="shadow-md">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có ứng viên nào sắp đi làm"
            />
          </Card>
        </div>
      </div>
      <div className="mt-4">
        <Card title="Phân bố ứng viên theo nguồn" className="shadow-md">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa có dữ liệu"
          />
        </Card>
      </div>
    </div>
  );
};

export default EmployerDashboard;
