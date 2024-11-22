import { Badge, Card } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '~/assets/svg';
import Button from '~/components/Button/Button';
import { Application } from '~/types/Job';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { EditOutlined, FilePdfOutlined } = icons;

interface MobileCardProps {
  record: Application['items'][0];
  handleEditClick: (record: Application['items'][0]) => void;
}

const MobileCard: React.FC<MobileCardProps> = ({ record, handleEditClick }) => {
  const navigate = useNavigate();

  const isBlue =
    record.status.id === 1 || record.status.id === 2 || record.status.id === 4;
  const isGreen = record.status.id === 3;

  return (
    <>
      <Card
        className="mb-4 shadow-sm"
        title={
          <>
            <div className="flex items-center gap-2">
              <User className="w-8 h-8 text-sub" />
              <span>{record.user.fullName}</span>
            </div>
          </>
        }
      >
        <div className="">
          <div className="flex flex-col">
            <p className="text-sub">Trạng thái</p>
            <div className="flex items-center gap-2 py-2">
              <Badge
                color={`${isBlue ? '#1677ff' : isGreen ? '#22c55e' : '#78726de6'}`}
              />
              <span
                className={`${
                  isBlue ? 'text-blue' : isGreen ? 'text-green-500' : 'text-sub'
                }`}
              >
                {record.status.title}
              </span>
              <EditOutlined
                className="cursor-pointer !text-sub"
                onClick={() => handleEditClick(record)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2  py-2">
            <p className="text-sub">Vị trí</p>
            <Link to={`/job/${record.job.id}`}>{record.job.title}</Link>
          </div>

          <div className="flex flex-col gap-2  py-2">
            <p className="text-sub">Ngày ứng tuyển</p>
            <div>
              <p className="text-sub">
                {dayjs(record.createAt).format('DD/MM/YYYY')} -{' '}
                <span className="text-sm text-gray-500">
                  {dayjs(record.createAt).fromNow()}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2  py-2">
            <p className="text-sub"> Cập nhật </p>
            <span>
              {dayjs(
                !record.employerUpdateAt
                  ? record.createAt
                  : record.employerUpdateAt
              ).format('DD/MM/YYYY')}
            </span>
          </div>

          <div>
            <Button
              title="Xem chi tiết"
              className="w-full mt-4"
              iconBefore={<FilePdfOutlined />}
              onClick={() =>
                navigate(PATH.EMPLOYER_RECRUITMENT_DETAIL, {
                  state: record,
                })
              }
            />
          </div>
        </div>
      </Card>
    </>
  );
};

export default MobileCard;
