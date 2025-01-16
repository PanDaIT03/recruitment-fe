import { Card, Empty } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { JobsAPI } from '~/apis/job';
import { useFetch } from '~/hooks/useFetch';
import { Application } from '~/types/Job';

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
  const { data: applicationJobs } = useFetch<Application>(
    ['JobsApplicants'],
    () =>
      JobsAPI.getAllJobsApplicants(3, undefined, {
        page: 1,
        pageSize: 1000,
      })
  );

  return (
    <div className="px-16 pt-4 min-h-screen">
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
          <Card title="Phỏng vấn sắp tới" className="shadow-md p-4">
            {applicationJobs?.items?.length !== 0 ? (
              applicationJobs?.items?.map((users) => (
                <div key={users?.user?.id} className="mb-2">
                  <h3 className="text-[14px] font-semibold">
                    {users?.user?.fullName} - {users?.job?.title}
                  </h3>
                  <ul className="list-disc px-6 space-y-2 mt-2">
                    {users?.schedules?.map((schedule, index) => (
                      <li key={index} className="text-xs text-gray-700">
                        <span className="font-medium">
                          {dayjs(schedule.date).format('HH:mm DD/MM/YYYY')}
                        </span>
                        <span className="ml-2 text-sub">{schedule.note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không có cuộc phỏng vấn nào sắp tới"
              />
            )}
          </Card>

          <Card title="Ứng viên sắp đi làm" className="shadow-md">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có ứng viên nào sắp đi làm"
            />
          </Card>
        </div>
      </div>
      {/* <div className="mt-4">
        <Card title="Phân bố ứng viên theo nguồn" className="shadow-md">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa có dữ liệu"
          />
        </Card>
      </div> */}
    </div>
  );
};

export default EmployerDashboard;
