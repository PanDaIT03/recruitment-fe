import { Badge, Dropdown, Modal, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import icons from '~/utils/icons';
import { JobPosting } from '../ManageJob';

import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate } from 'react-router-dom';
import { JobsAPI } from '~/apis/job';
import Button from '~/components/Button/Button';
import { JOB_STATUS } from '~/utils/constant';
import toast from '~/utils/functions/toast';
import PATH from '~/utils/path';

dayjs.extend(relativeTime);
dayjs.locale('vi');

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
} = icons;

const { Text, Paragraph } = Typography;

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
  const [isOpenModalDeleteJob, setisOpenModalDeleteJob] = useState(false);

  const isActiveJob = item.jobstatus === JOB_STATUS.ACTIVE;
  const isInActiveJob = item.jobstatus === JOB_STATUS.INACTIVE;

  const determineNextStatus = (status: string) => {
    switch (status) {
      case JOB_STATUS.ACTIVE:
        return JOB_STATUS.INACTIVE;
      case JOB_STATUS.INACTIVE:
        return JOB_STATUS.ACTIVE;
      default:
        return JOB_STATUS.DELETED;
    }
  };

  const handleChangeStatusJob = async (id: number, status: string) => {
    try {
      const response = await JobsAPI.updateJob(id.toString(), { status });
      toast[response?.statusCode === 200 ? 'success' : 'error'](
        response?.message || ''
      );

      if (response.statusCode === 200) refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModal = () => {
    setisOpenModalDeleteJob(!isOpenModalDeleteJob);
  };

  const jobContent = (
    <div className="w-full p-4">
      <Tag
        color={isActiveJob ? 'success' : isInActiveJob ? 'warning' : 'error'}
        className="flex gap-2 mb-2 w-fit"
      >
        <Badge
          color={isActiveJob ? 'green' : isInActiveJob ? 'yellow' : 'red'}
          className="rounded-full"
        />
        <p>{item.jobstatus}</p>
      </Tag>

      <h3 className="text-sm font-medium mb-1">{item.jobTitle}</h3>
      <div className="flex items-center text-gray-500 text-sm mb-3">
        <span>
          <UserOutlined />
        </span>
        <span className="mx-2 text-sm">{item.userFullName}</span>
        <span className="text-sm">• {dayjs(item.jobCreateAt).fromNow()}</span>
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
                  label: determineNextStatus(item.jobstatus),
                  icon: <RightCircleOutlined />,
                  onClick: () =>
                    handleChangeStatusJob(
                      item.id,
                      determineNextStatus(item.jobstatus)
                    ),
                  className: 'hover:!bg-[#ff580033]',
                },
                {
                  key: '4',
                  label: 'Xóa tin',
                  icon: <DeleteOutlined />,
                  onClick: toggleModal,
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

      <Modal
        open={isOpenModalDeleteJob}
        onCancel={toggleModal}
        title="Xoá tin tuyển dụng"
        footer={null}
      >
        <Paragraph className="flex flex-col">
          <Text className="text-orange-600">
            - Tin đã xóa có thể khôi phục lại trong vòng 30 ngày.
          </Text>
          <Text>- Tin đã xóa không thể khôi phục lại.</Text>
          <Text>
            - Tất cả ứng viên đang ứng tuyển vào tin này sẽ bị hủy ứng tuyển.
          </Text>
        </Paragraph>
        <div className="flex items-center justify-center gap-2">
          <Button title="Hủy" onClick={toggleModal} className="w-full" />
          <Button
            title="Xác nhận"
            fill
            className="w-full"
            onClick={toggleModal}
          />
        </div>
      </Modal>
    </>
  );
};

export default JobListItem;
