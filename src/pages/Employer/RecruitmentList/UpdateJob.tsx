import { Card, Spin, Typography } from 'antd';
import icons from '~/utils/icons';
import ModalBen from './ModalUpdate/ModalBen';
import ModalDesc from './ModalUpdate/ModalDesc';
import ModalReq from './ModalUpdate/ModalReq';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getJobById } from '~/store/thunk/job';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { JobItem } from '~/types/Job';
import { formatCurrencyVN } from '~/utils/functions/formatNumber';
import ModalInfo from './ModalUpdate/ModalInfo';
import { JobsAPI } from '~/apis/job';
import toast from '~/utils/functions/toast';

const { EditOutlined, ArrowLeftOutlined } = icons;

const { Title, Text } = Typography;

enum SelectModal {
  DESCRIPTION = 'DESC',
  REQUIREMENT = 'REQ',
  BENEFIT = 'BEN',
  INFOMATION = 'INFO',
}

const UpdateJob = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const dataJob: JobItem = location.state;
  const { currentJob, loading } = useAppSelector((state) => state.jobs);
  const [jobData, setJobData] = useState<JobItem>(dataJob);

  const [openModal, setOpenModal] = useState<SelectModal | null>(null);

  const priceRange =
    currentJob?.salaryMin && currentJob?.salaryMax
      ? `${formatCurrencyVN(Number(currentJob?.salaryMin))} - ${formatCurrencyVN(Number(currentJob?.salaryMax))}`
      : currentJob?.salaryMin
        ? ` ${formatCurrencyVN(Number(currentJob?.salaryMin))}`
        : currentJob?.salaryMax
          ? ` ${formatCurrencyVN(Number(currentJob?.salaryMax))}`
          : 'Thương lượng';

  const handleOpenModal = (modalType: SelectModal) => {
    setOpenModal(modalType);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  useEffect(() => {
    dispatch(getJobById(currentJob?.id.toString()));
  }, [currentJob?.id, dispatch]);

  const handleSubmit = async (data: Partial<JobItem>) => {
    const {
      id,
      createBy,
      createAt,
      updateBy,
      updateAt,
      applicationDeadline,
      user,
      jobPosition,
      jobField,
      jobsPlacements,
      workType,
      jobCategory,
      ...payload
    } = data;
    try {
      const response = await JobsAPI.updateJob(jobData?.id.toString(), payload);

      toast[response?.statusCode === 200 ? 'success' : 'error'](
        response?.message || ''
      );
      if (response?.statusCode === 200) {
        dispatch(getJobById(currentJob?.id.toString()));
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleModalUpdate = (field: keyof JobItem, value: any) => {
    const updatedJobData = { ...jobData, [field]: value };
    setJobData(updatedJobData);
    handleSubmit(updatedJobData);
  };

  if (!currentJob || loading) {
    return (
      <div className="flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <ArrowLeftOutlined
        className="ml-4 cursor-pointer"
        style={{ fontSize: 24 }}
        onClick={() => navigate(-1)}
      />
      <div className="flex flex-col md:flex-row gap-4 p-4 ">
        <div className="w-full md:w-1/3">
          <div className="sticky top-16">
            <Card
              className="w-full"
              title={<Title level={4}>Thông tin</Title>}
              extra={
                <EditOutlined
                  className="cursor-pointer"
                  onClick={() => handleOpenModal(SelectModal.INFOMATION)}
                />
              }
            >
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Text>Lĩnh vực</Text>
                  <Text className="font-semibold">
                    {currentJob?.jobField?.title}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text>Loại công việc</Text>
                  <Text className="font-semibold text-purple-600">
                    {currentJob?.jobCategory?.name}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text>Hình thức làm việc</Text>
                  <Text className="font-semibold text-orange-500">
                    {currentJob?.workType?.title}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text>Địa điểm</Text>
                  <Text className="font-semibold">
                    {currentJob?.jobsPlacements
                      ?.map((place) => place.placement.title)
                      .join(' - ')}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text>Số lượng</Text>
                  <Text className="font-semibold">{currentJob?.quantity}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Mức lương</Text>
                  <Text className="font-semibold text-red-500">
                    {priceRange}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text>Đăng bởi</Text>
                  <Text className="font-semibold">
                    {currentJob?.user?.fullName}
                  </Text>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="w-full md:w-2/3 space-y-4">
          <Card
            title={<Title level={4}>Mô tả công việc</Title>}
            extra={
              <EditOutlined
                className="cursor-pointer"
                onClick={() => handleOpenModal(SelectModal.DESCRIPTION)}
              />
            }
          >
            <ul
              className="list-disc pl-5 space-y-2"
              dangerouslySetInnerHTML={{
                __html: currentJob.description,
              }}
            />
          </Card>

          <Card
            title={<Title level={4}>Yêu cầu công việc</Title>}
            extra={
              <EditOutlined
                className="cursor-pointer"
                onClick={() => handleOpenModal(SelectModal.REQUIREMENT)}
              />
            }
          >
            <ul
              className="list-disc pl-5 space-y-2"
              dangerouslySetInnerHTML={{
                __html: currentJob.requirements,
              }}
            />
          </Card>

          <Card
            title={<Title level={4}>Phúc lợi</Title>}
            extra={
              <EditOutlined
                className="cursor-pointer"
                onClick={() => handleOpenModal(SelectModal.BENEFIT)}
              />
            }
          >
            <ul
              className="list-disc pl-5 space-y-2"
              dangerouslySetInnerHTML={{
                __html: currentJob.benefits,
              }}
            />
          </Card>
        </div>
      </div>

      <ModalBen
        open={openModal === SelectModal.BENEFIT}
        onClose={handleCloseModal}
        initContent={currentJob?.benefits}
        onUpdate={(value) => handleModalUpdate('benefits', value)}
      />

      <ModalDesc
        open={openModal === SelectModal.DESCRIPTION}
        onClose={handleCloseModal}
        initContent={currentJob?.description}
        onUpdate={(value) => handleModalUpdate('description', value)}
      />

      <ModalReq
        open={openModal === SelectModal.REQUIREMENT}
        onClose={handleCloseModal}
        initContent={currentJob?.requirements}
        onUpdate={(value) => handleModalUpdate('requirements', value)}
      />

      <ModalInfo
        open={openModal === SelectModal.INFOMATION}
        onClose={handleCloseModal}
        initData={currentJob}
        // onUpdate={(updatedData) => setJobData(updatedData)}
      />
    </>
  );
};

export default UpdateJob;
