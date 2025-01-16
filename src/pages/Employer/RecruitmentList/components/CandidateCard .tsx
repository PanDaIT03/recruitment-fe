import { Avatar, Badge, Button, Card, Divider } from 'antd';
import { ApplicationJobDetail } from '~/types/Job';
import icons from '~/utils/icons';
import dayjs from 'dayjs';

const { PlusOutlined, EditOutlined } = icons;

interface CandidateCardProps {
  data: any;
  applicationJobs: ApplicationJobDetail | undefined;
  handleEditClick: (record: any) => void;
}

const CandidateCard = ({
  data,
  applicationJobs,
  handleEditClick,
}: CandidateCardProps) => {
  const isBlue =
    applicationJobs?.status?.id === 1 ||
    applicationJobs?.status?.id === 2 ||
    applicationJobs?.status?.id === 4;
  const isGreen = applicationJobs?.status?.id === 3;

  return (
    <Card bordered={false} className="shadow-sm rounded-2xl w-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar size={40} className="bg-gray-200" />
          <div>
            <h2 className="text-lg font-medium">{data[0]?.user?.fullName}</h2>
            <p className="text-sub">{data[0]?.job?.title}</p>
            <Button
              type="text"
              className="text-orange-500 px-0 flex items-center"
              icon={<PlusOutlined className="text-orange-500" />}
            >
              Gắn hashtag
            </Button>
          </div>
        </div>
      </div>
      <Divider className="w-full" />
      <div className="flex items-center justify-between">
        <p className="text-sub">Vị trí</p>
        <p>{applicationJobs?.job?.title}</p>
      </div>
      <div className="flex items-center justify-between my-2">
        <p className="text-sub">Trạng thái</p>
        <p>
          <Badge
            color={isBlue ? '#1677ff' : isGreen ? '#22c55e' : '#78726de6'}
          />
          <span
            className={`${isBlue ? 'text-blue' : isGreen ? 'text-green-500' : 'text-sub'} mx-2`}
          >
            {applicationJobs?.status?.title}
          </span>
          <span>
            <EditOutlined
              className="cursor-pointer"
              onClick={() => handleEditClick(applicationJobs)}
            />
          </span>
        </p>
      </div>
      <div className="flex items-center justify-between my-2">
        <p className="text-sub">Ngày ứng tuyển</p>
        <p>{dayjs(data[0]?.createAt).format('HH:MM DD/MM/YYYY')}</p>
      </div>
    </Card>
  );
};

export default CandidateCard;
