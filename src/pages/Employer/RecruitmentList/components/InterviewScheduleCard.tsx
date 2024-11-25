import { Button, Card } from 'antd';
import dayjs from 'dayjs';
import { Schedule } from '~/types/Job';
import icons from '~/utils/icons';

const { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined } = icons;

interface InterviewScheduleCardProps {
  schedulesInterview: any;
  handleOpenModal: (interview?: any) => void;
  handleDeleteInterview: (id: number) => void;
}

const InterviewScheduleCard = ({
  schedulesInterview,
  handleOpenModal,
  handleDeleteInterview,
}: InterviewScheduleCardProps) => (
  <Card
    className="shadow-sm rounded-2xl mt-4 !w-full"
    title={
      <div className="flex items-center space-x-2">
        <CalendarOutlined />
        <span>Lịch phỏng vấn</span>
      </div>
    }
    extra={
      <Button
        type="text"
        className="text-orange-500"
        icon={<PlusOutlined className="text-orange-500" />}
        onClick={() => handleOpenModal()}
      >
        Thêm
      </Button>
    }
  >
    {schedulesInterview?.items.length === 0 ? (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">📅</span>
        </div>
        <p className="text-gray-400 mb-4">Chưa có lịch phỏng vấn nào</p>
        <Button
          type="text"
          className="text-orange-500"
          icon={<PlusOutlined className="text-orange-500" />}
          onClick={() => handleOpenModal()}
        >
          Thêm lịch phỏng vấn
        </Button>
      </div>
    ) : (
      <ul className="list-disc mx-2">
        {schedulesInterview?.items?.map((schedule: Schedule['items'][0]) => (
          <li key={schedule.id} className="my-2">
            <div className="flex items-center justify-between">
              <span>{dayjs(schedule.date).format('HH:mm - DD/MM/YYYY')}</span>
              <p className="flex gap-4">
                <DeleteOutlined
                  className="cursor-pointer hover:!text-red-500"
                  onClick={() => handleDeleteInterview(schedule.id)}
                />
                <EditOutlined
                  className="cursor-pointer hover:!text-[#ff580033]"
                  onClick={() => handleOpenModal(schedule)}
                />
              </p>
            </div>
            <span className="text-sub text-xs">{schedule.note}</span>
          </li>
        ))}
      </ul>
    )}
  </Card>
);

export default InterviewScheduleCard;
