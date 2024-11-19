import { Avatar, Badge, Button, Card, Divider, Modal } from 'antd';
import { useLocation } from 'react-router-dom';
import { JobsAPI } from '~/apis/job';
import { MenuIcon } from '~/assets/svg';
import PDFViewer from '~/components/Pdf/ViewPdf';
import { useFetch } from '~/hooks/useFetch';
import icons from '~/utils/icons';
import ModalIntervew from './ModalInterview';
import { useState } from 'react';
import { Application, ApplicationJobDetail, Schedule } from '~/types/Job';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useBreadcrumb from '~/hooks/useBreadcrumb';
import PATH from '~/utils/path';
import toast from '~/utils/functions/toast';
import ModalStatusJob from '~/components/Modal/ModalStatusJob';
dayjs.extend(relativeTime);
dayjs.locale('vi');

const { PlusOutlined, EditOutlined, CalendarOutlined, DeleteOutlined } = icons;

const RecruimentDetail = () => {
  const location = useLocation();
  const data = location.state;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<{
    id: number;
    date: string;
    note: string;
  } | null>(null);
  const [isOpenModalStatus, setIsOpenModalStatus] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<
    Application['items'][0] | null
  >(null);

  const customBreadcrumbItems = [
    {
      path: PATH.EMPLOYER_RECRUITMENT,
      label: 'Tuyển dụng',
    },
    {
      path: PATH.EMPLOYER_RECRUITMENT_DETAIL,
      label: data[0]?.user?.fullName || '',
    },
  ];

  const breadcrumb = useBreadcrumb(customBreadcrumbItems, 'text-white');

  const { data: applicationJobs, refetch } = useFetch<ApplicationJobDetail>(
    ['getApplicantsDetail', data.usersId, data.jobsId],
    () => JobsAPI.getApplicantsDetail(data[0].usersId, data[0].jobsId)
  );

  const { data: schedulesInterview, refetch: refetchSchedules } =
    useFetch<Schedule>(['schedulesInterview', data.usersId, data.jobsId], () =>
      JobsAPI.getSchedulesInterview(data[0].usersId, data[0].jobsId)
    );

  const handleOpenModal = (interview?: any) => {
    setSelectedInterview(interview);
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedInterview(null);
    setIsOpenModal(false);
  };

  const handleDeleteInterview = async (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa lịch phỏng vấn này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const response = await JobsAPI.deleteSchedule(id);
          if (response.statusCode === 200) {
            toast.success(response.message);
            refetchSchedules();
          }
        } catch (error) {
          console.error(error);
          toast.error('Có lỗi xảy ra khi xóa lịch phỏng vấn');
        }
      },
    });
  };

  const toggleModal = () => setIsOpenModalStatus(!isOpenModalStatus);

  const handleEditClick = (record: any) => {
    setSelectedRecord(record);
    toggleModal();
  };

  return (
    <>
      <div className="bg-secondary border-t border-[#561d59]">
        <p className="px-16 w-full py-2">{breadcrumb}</p>
      </div>
      <div className="px-16 py-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Card bordered={false} className="shadow-sm rounded-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar size={40} className="bg-gray-200" />
                  <div>
                    <h2 className="text-lg font-medium">
                      {data[0]?.user?.fullName}
                    </h2>
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
                  <Badge color="blue" />
                  <span className="text-blue mx-2">
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
                <p>
                  {dayjs(data[0]?.createAt).format('HH:MM DD/MM/YYYY')}
                  <br />
                  <span className="text-xs text-sub">
                    {dayjs(data[0]?.createAt).fromNow()}
                  </span>
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sub">Cập nhật</p>
                <p> {dayjs(data[0]?.createAt).fromNow()}</p>
              </div>
            </Card>

            <Card
              className="shadow-sm rounded-2xl mt-4"
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
              <div className="">
                {schedulesInterview?.items.length === 0 ? (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📅</span>
                    </div>
                    <p className="text-gray-400 mb-4">
                      Chưa có lịch phỏng vấn nào
                    </p>
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
                    {schedulesInterview?.items?.map((schedule) => (
                      <li key={schedule.id} className="my-2">
                        <div className="flex items-center justify-between">
                          <span>
                            {dayjs(schedule.date).format('HH:mm - DD/MM/YYYY')}
                          </span>
                          <p className="flex gap-4">
                            <span>
                              <DeleteOutlined
                                className="cursor-pointer hover:!text-red-500"
                                onClick={() =>
                                  handleDeleteInterview(schedule.id)
                                }
                              />
                            </span>
                            <span>
                              <EditOutlined
                                className="cursor-pointer hover:!text-[#ff580033]"
                                onClick={() => handleOpenModal(schedule)}
                              />
                            </span>
                          </p>
                        </div>
                        <span className="text-sub text-xs">
                          {schedule.note}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          </div>
          <div className="col-span-2 w-full h-full">
            <Card
              className="rounded-2xl"
              title={
                <div className="w-full flex items-center justify-center gap-2">
                  <span>
                    <MenuIcon />
                  </span>
                  <span>{applicationJobs?.curriculumVitae?.fileName}</span>
                </div>
              }
            >
              <PDFViewer
                fileUrl={applicationJobs?.curriculumVitae?.url}
                fileName={applicationJobs?.curriculumVitae?.fileName}
              />
            </Card>
          </div>
        </div>
      </div>
      <ModalIntervew
        isOpen={isOpenModal}
        onClose={handleCloseModal}
        data={applicationJobs}
        refetch={refetchSchedules}
        refetchAppJ={refetch}
        editData={selectedInterview}
      />
      <ModalStatusJob
        isOpen={isOpenModalStatus}
        handleCancel={toggleModal}
        data={selectedRecord}
        refetch={refetch}
      />
    </>
  );
};

export default RecruimentDetail;
