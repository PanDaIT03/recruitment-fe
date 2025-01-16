import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { JobsAPI } from '~/apis/job';
import { useFetch } from '~/hooks/useFetch';
import ModalIntervew from './ModalInterview';
import ModalStatusJob from '~/components/Modal/ModalStatusJob';
import toast from '~/utils/functions/toast';
import { Modal } from 'antd';
import { ApplicationJobDetail } from '~/types/Job';
import CandidateCard from './components/CandidateCard ';
import InterviewScheduleCard from './components/InterviewScheduleCard';
import CVViewer from './components/CVViewer';
import PATH from '~/utils/path';
import useBreadcrumb from '~/hooks/useBreadcrumb';

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
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

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
    () => JobsAPI.getApplicantsDetail(data.usersId, data.jobsId)
  );

  const { data: schedulesInterview, refetch: refetchSchedules } = useFetch(
    ['schedulesInterview', data.usersId, data.jobsId],
    () => JobsAPI.getSchedulesInterview(data.usersId, data.jobsId)
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
          toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
      },
    });
  };
  const toggleModal = () => setIsOpenModalStatus(!isOpenModalStatus);

  const handleEditClick = (record: any) => {
    setSelectedRecord(record);
    setIsOpenModalStatus(true);
  };

  return (
    <>
      <div className="bg-secondary border-t border-[#561d59] w-full">
        <p className="px-16 w-full py-2">{breadcrumb}</p>
      </div>
      <div className="mt-8 grid lg:gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 px-4 lg:px-16 w-full">
        <div className="w-full">
          <CandidateCard
            data={data}
            applicationJobs={applicationJobs}
            handleEditClick={handleEditClick}
          />
          <InterviewScheduleCard
            schedulesInterview={schedulesInterview}
            handleOpenModal={handleOpenModal}
            handleDeleteInterview={handleDeleteInterview}
          />
        </div>
        <div className="col-span-2 mt-4 lg:mt-0">
          <CVViewer applicationJobs={applicationJobs} />
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
