import { Table } from 'antd';
import Select, { DefaultOptionType } from 'antd/es/select';
import React from 'react';

const optionStatus: DefaultOptionType[] = [
  {
    label: 'Trạng thái',
    value: 'all',
  },
  {
    label: 'Đang đánh giá',
    value: 'review',
  },
  {
    label: 'Phỏng vấn',
    value: 'interview',
  },
  {
    label: 'Đang offer',
    value: 'offer',
  },
  {
    label: 'Đang tuyển dụng',
    value: 'recruiting',
  },
  {
    label: 'Đã đóng',
    value: 'close',
  },
];

const RecruitmentList: React.FC = () => {
  const columns = [
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Ứng viên',
      dataIndex: 'candidate',
      key: 'candidate',
    },
    {
      title: 'Vị trí tuyển dụng',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Ngày ứng tuyển',
      dataIndex: 'applicationDate',
      key: 'applicationDate',
    },
    {
      title: 'Cập nhật',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
    },
  ];

  const data: any[] = [];

  return (
    <>
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-800 mb-4">
            Danh sách tuyển dụng
          </h1>
          <p className="text-gray-600 mb-4">Có 0 hồ sơ được tìm thấy</p>
        </div>
        <Select
          options={optionStatus}
          className="w-1/12"
          defaultValue={'Trạng thái'}
        ></Select>
      </div>

      <div className="p-6 bg-white">
        <Table columns={columns} dataSource={data} className="mb-4" />
      </div>
    </>
  );
};

export default RecruitmentList;
