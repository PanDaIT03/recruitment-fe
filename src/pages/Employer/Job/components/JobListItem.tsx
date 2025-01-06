import { Badge, Dropdown, Tag } from 'antd';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobsAPI } from '~/apis/job';
import { JOB_STATUS } from '~/utils/constant';
import toast from '~/utils/functions/toast';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import { JobPosting } from '../ManageJob';
import DeleteJobModal from './Modal/DeleteModal';
import RecoverJobModal from './Modal/RecoverModal';

const {
  DollarCircleOutlined,
  MoreOutlined,
  DesktopOutlined,
  UsergroupAddOutlined,
  CalendarFilled,
  UserOutlined,
  EyeOutlined,
  FilePdfOutlined,
  RightCircleOutlined,
  DeleteOutlined,
  ReloadOutlined,
} = icons;

const formatSalaryRange = (min: number | null, max: number | null) => {
  if (!min && !max) return 'Thương lượng';
  if (!min) return `Tối đa ${max?.toLocaleString('vi-VN')}đ`;
  if (!max) return `Tối thiểu ${min?.toLocaleString('vi-VN')}đ`;
  return `${min?.toLocaleString('vi-VN')}đ - ${max?.toLocaleString('vi-VN')}đ`;
};

interface JobListItemProps {
  item: JobPosting;
  refetch: () => void;
}

const JobListItem: React.FC<JobListItemProps> = ({ item, refetch }) => {
  const navigate = useNavigate();
  const [isOpenModalDeleteJob, setIsOpenModalDeleteJob] = useState(false);
  const [isOpenModalRecoverJob, setIsOpenModalRecoverJob] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);

  const isActiveJob = item.jobstatus === JOB_STATUS.ACTIVE;
  const isInActiveJob = item.jobstatus === JOB_STATUS.INACTIVE;

  const handleChangeStatusJob = async (id: number, statusId: number) => {
    try {
      const response = await JobsAPI.updateJob(id.toString(), { statusId });
      toast[response?.statusCode === 200 ? 'success' : 'error'](
        response?.message || ''
      );
      if (response.statusCode === 200) refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModalDelete = () =>
    setIsOpenModalDeleteJob(!isOpenModalDeleteJob);
  const toggleModalRecover = () =>
    setIsOpenModalRecoverJob(!isOpenModalRecoverJob);

  const handleDeleteClick = (record: JobPosting['id']) => {
    setSelectedRecord(record);
    toggleModalDelete();
  };

  const handleRecoverClick = (record: JobPosting['id']) => {
    setSelectedRecord(record);
    toggleModalRecover();
  };

  const handleDeleteJob = async (id: number) => {
    try {
      const response = await JobsAPI.deleteJob(id);
      toast[response?.statusCode === 200 ? 'success' : 'error'](
        response?.message || ''
      );
      if (response.statusCode === 200) {
        refetch();
        toggleModalDelete();
      }
    } catch (error) {}
  };

  const handleRecoverJob = async (id: number) => {
    try {
      const response = await JobsAPI.restoreJob(id);
      toast[response?.statusCode === 200 ? 'success' : 'error'](
        response?.message || ''
      );
      if (response.statusCode === 200) {
        refetch();
        toggleModalRecover();
      }
    } catch (error) {}
  };

  const jobContent = useMemo(
    () => (
      <div className="w-full p-4">
        <Tag
          color={isActiveJob ? 'success' : isInActiveJob ? 'warning' : 'error'}
          className="flex gap-2 mb-2 w-fit"
        >
          <Badge
            color={isActiveJob ? 'green' : isInActiveJob ? 'yellow' : 'red'}
            className="rounded-full"
          />
          <p>{item.status}</p>
        </Tag>
        <h3 className="text-sm font-medium mb-1">{item.jobTitle}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <span>
            <UserOutlined />
          </span>
          <span className="mx-2 text-sm">{item.userFullName}</span>
          {/* <span className="text-sm">
            • {dayjs(item.jobCreateAt)?.fromNow() || 'N/A'}
          </span> */}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <Tag
            className="font-bold"
            icon={<DollarCircleOutlined />}
            color="green"
          >
            {formatSalaryRange(item.jobSalaryMin, item.jobSalaryMax)}
          </Tag>
          <Tag className="font-bold" color="purple" icon={<CalendarFilled />}>
            {item.jobCategoryName}
          </Tag>
          <Tag className="font-bold" icon={<DesktopOutlined />} color="orange">
            {item.workTypeTitle}
          </Tag>
          <Tag
            className="font-bold"
            icon={<UsergroupAddOutlined />}
            color="yellow"
          >
            {item.jobQuantity}
          </Tag>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="flex cursor-pointer items-center">
            Đang đánh giá
            <Tag className="ml-1 bg-[#ff5800] text-white">
              {item.evaluatingCount}
            </Tag>
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex cursor-pointer items-center">
            Phỏng vấn
            <Tag className="ml-1 bg-[#ff5800] text-white">
              {item.interviewingCount}
            </Tag>
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex cursor-pointer items-center">
            Đang offer
            <Tag className="ml-1 bg-[#ff5800] text-white">
              {item.offeringCount}
            </Tag>
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex cursor-pointer items-center text-green-600">
            Đã tuyển
            <Tag className="ml-1 bg-[#52c41a] text-white">
              {item.recruitingCount}
            </Tag>
          </span>
          <span className="flex cursor-pointer items-center text-gray-400">
            Đã đóng <Tag className="ml-1">{item.recruitingCount}</Tag>
          </span>
        </div>
      </div>
    ),
    [item]
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 relative">
        {jobContent}
        <div className="absolute top-2 right-2">
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  label: 'Xem tin đã đăng',
                  icon: <EyeOutlined />,
                  onClick: () => window.open(`/job/${item.id}`, '_blank'),
                  className: 'hover:!bg-[#ff580033]',
                },
                {
                  key: '2',
                  label: 'Xem mô tả',
                  icon: <FilePdfOutlined />,
                  onClick: () => navigate(PATH.UPDATE_JOB, { state: item }),
                  className: 'hover:!bg-[#ff580033]',
                },
                {
                  key: '3',
                  label: isActiveJob ? 'Ngừng tuyển' : 'Tuyển lại',
                  icon: <RightCircleOutlined />,
                  onClick: () =>
                    handleChangeStatusJob(
                      item.id,
                      isActiveJob ? JOB_STATUS.INACTIVE : JOB_STATUS.ACTIVE
                    ),
                  className: 'hover:!bg-[#ff580033]',
                },
                {
                  key: '4',
                  label:
                    item.jobstatus === JOB_STATUS.DELETED
                      ? 'Khôi phục'
                      : 'Xóa tin',
                  icon:
                    item.jobstatus === JOB_STATUS.DELETED ? (
                      <ReloadOutlined />
                    ) : (
                      <DeleteOutlined />
                    ),
                  onClick: () =>
                    item.jobstatus === JOB_STATUS.DELETED
                      ? handleRecoverClick(item.id)
                      : handleDeleteClick(item.id),
                  className: 'hover:!bg-red-500 hover:!text-white',
                },
              ],
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <MoreOutlined />
          </Dropdown>
        </div>
      </div>

      <DeleteJobModal
        open={isOpenModalDeleteJob}
        onCancel={toggleModalDelete}
        onConfirm={() => selectedRecord && handleDeleteJob(selectedRecord)}
      />
      <RecoverJobModal
        open={isOpenModalRecoverJob}
        onCancel={toggleModalRecover}
        onConfirm={() => selectedRecord && handleRecoverJob(selectedRecord)}
      />
    </>
  );
};

export default JobListItem;
