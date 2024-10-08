import { Card, Col, Divider, Row, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useBreadcrumb from '~/hooks/useBreadcrumb';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getJobById } from '~/store/thunk/job';
import { formatCurrencyVN } from '~/utils/functions/formatNumber';
import icons from '~/utils/icons';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import JobApplicationModal from './JobApplicationModal/JobApplicationModal';

const {
  AppstoreOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  EnvironmentOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  LaptopOutlined,
  ShareAltOutlined,
  TeamOutlined,
} = icons;

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const rightColRef = useRef<HTMLDivElement>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { currentJob, loading } = useAppSelector((state) => state.jobs);
  const dispatch = useAppDispatch();

  const customBreadcrumbItems = [
    { path: '/jobs', label: 'Tin tuyển dụng' },
    {
      path: `/job/${id}`,
      label: currentJob?.[0]?.title || 'Chi tiết công việc',
    },
  ];

  const breadcrumb = useBreadcrumb(customBreadcrumbItems);

  useEffect(() => {
    dispatch(getJobById(id));
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (rightColRef.current) {
        const parentRect =
          rightColRef.current.parentElement?.getBoundingClientRect();

        if (parentRect) {
          if (window.scrollY > parentRect.top) {
            rightColRef.current.style.position = 'fixed';
            rightColRef.current.style.top = '65px';
            rightColRef.current.style.width = `${parentRect.width}px`;
          } else {
            rightColRef.current.style.position = 'static';
            rightColRef.current.style.width = '100%';
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleIsOpenModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  if (!currentJob || currentJob.length === 0 || loading) {
    return (
      <div className="flex items-center justify-center">
        <Spin size="large" />;
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {breadcrumb}
      <Row gutter={[16, 16]} className="flex flex-col md:flex-row">
        <Col xs={24} md={16} className="mb-4 md:mb-0">
          <Button
            className="w-full md:hidden mb-4"
            iconBefore={<TeamOutlined />}
            title="Ứng tuyển ngay"
            onClick={handleIsOpenModal}
          />
          <div className="mb-4 hidden md:block">
            <h1 className="text-2xl font-bold mb-2">{currentJob[0]?.title}</h1>
            <p className="text-gray-500 mb-4">
              {currentJob[0]?.user?.companyName}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                iconBefore={<ShareAltOutlined />}
                className="mb-2 sm:mb-0"
                title="Chia sẻ"
              />

              <Button
                fill
                className="w-full sm:w-auto"
                title="Ứng tuyển ngay"
                onClick={handleIsOpenModal}
              />
            </div>
          </div>
          <Card className="shadow-md">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">
              Chi tiết tin tuyển dụng
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 bg-purple-100 rounded-md p-4">
              <div className="flex items-center">
                <EnvironmentOutlined className="text-2xl mr-2 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Địa điểm</p>
                  <p className="font-medium">
                    {currentJob[0]?.jobsPlacements
                      ?.map((place) => place?.placement?.title)
                      .join(' - ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarCircleOutlined className="text-2xl mr-2 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Mức lương</p>
                  <p className="font-medium">
                    {currentJob[0]?.salaryMin && currentJob[0]?.salaryMax
                      ? `${formatCurrencyVN(Number(currentJob[0]?.salaryMin))} - ${formatCurrencyVN(Number(currentJob[0]?.salaryMax))}`
                      : 'Thương lượng'}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <LaptopOutlined className="text-2xl mr-2 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Hình thức làm việc</p>
                  <p className="font-medium">
                    {currentJob[0]?.workType?.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <ClockCircleOutlined className="text-2xl mr-2 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Loại công việc</p>
                  <p className="font-medium">
                    {currentJob[0]?.jobCategory?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <AppstoreOutlined className="text-2xl mr-2 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Kinh nghiệm</p>
                  <p className="font-medium">
                    {currentJob[0]?.minExpYearRequired &&
                    currentJob[0]?.maxExpYearRequired
                      ? `${currentJob[0]?.minExpYearRequired} - ${currentJob[0]?.maxExpYearRequired} năm`
                      : 'Không yêu cầu'}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <TeamOutlined className="text-2xl mr-2 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Số lượng</p>
                  <p className="font-medium">{currentJob[0]?.quantity}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
              <InfoCircleOutlined className="text-blue-500 mr-2" />
              <span className="text-blue-700">
                Tin tuyển dụng này đang nhận hồ sơ ứng tuyển...
              </span>
            </div>
            <Divider />

            <section className="mb-6">
              <h2 className="text-xl font-bold mb-2">Mô tả công việc</h2>
              <ul
                className="list-disc pl-5 space-y-2"
                dangerouslySetInnerHTML={{ __html: currentJob[0]?.description }}
              />
            </section>

            <Divider />

            <section className="mb-6">
              <h2 className="text-xl font-bold mb-2">Yêu cầu công việc</h2>
              <ul
                className="list-disc pl-5 space-y-2"
                dangerouslySetInnerHTML={{
                  __html: currentJob[0]?.requirements,
                }}
              />
            </section>

            <Divider />

            <section>
              <h2 className="text-xl font-bold mb-2">Quyền lợi</h2>
              <ul
                className="list-disc pl-5 space-y-2"
                dangerouslySetInnerHTML={{ __html: currentJob[0]?.benefits }}
              />
            </section>
          </Card>
        </Col>

        <Button
          className="w-full md:hidden"
          type="button"
          iconBefore={<TeamOutlined />}
          title="Ứng tuyển ngay"
          onClick={handleIsOpenModal}
        />
        <Col xs={24} md={8} className="hidden md:block">
          <Card className="shadow-md " ref={rightColRef}>
            <h2 className="text-lg font-semibold mb-4">
              {currentJob[0]?.user?.fullName}
            </h2>

            <div className="flex items-center mb-4">
              <div className="bg-gray-200 p-2 rounded-lg mr-3">
                <TeamOutlined className="text-2xl text-gray-500" />
              </div>
              <div>
                <p className="font-medium">
                  {currentJob[0]?.user?.companyName}
                </p>
                <p className="text-orange-500">Chưa được xác minh</p>
              </div>
            </div>

            <Divider />
            <div className="space-y-2 mb-4">
              {[
                {
                  label: 'Tên công ty :',
                  value: currentJob[0]?.user?.companyName,
                },
                {
                  label: 'Tình trạng xác minh : ',
                  value: 'Chưa được xác minh',
                  className: 'text-orange-500',
                },
                { label: 'Lĩnh vực:', value: 'Giáo dục' },
                {
                  label: 'Website:',
                  value: (
                    <Link
                      to="https://recruitment-fe-vi.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center"
                    >
                      ieltsvietop.vn/tuyen-dung
                      <ExportOutlined className="ml-1" />
                    </Link>
                  ),
                },
              ].map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-500">{item.label}</span>
                  <span className={item.className}>{item.value}</span>
                </div>
              ))}
            </div>
            <Button
              fill
              title="Ứng tuyển ngay"
              className="w-full"
              onClick={handleIsOpenModal}
            />
          </Card>
        </Col>
      </Row>
      <Modal isOpen={isOpenModal} footer={null} closeIcon={false}>
        <JobApplicationModal
          jobTitle={currentJob?.[0]?.title || ''}
          handleToggleModal={handleIsOpenModal}
        />
      </Modal>
    </div>
  );
};

export default JobDetail;
