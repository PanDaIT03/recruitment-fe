import { Col, Modal, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useBreadcrumb from '~/hooks/useBreadcrumb';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import useToken from '~/hooks/useToken';
import { getJobById } from '~/store/thunk/job';
import PATH from '~/utils/path';
import JobApplicationModal from '../JobApplicationModal/JobApplicationModal';
import JobContent from './components/JobContent';
import JobHeader from './components/JobHeader';
import JobSidebar from './components/JobSidebar';
import LoginModal from './components/LoginModal';
import ShareModal from './components/ShareModal';

const JobDetail: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { token } = useToken();
  const { id } = useParams<{ id: string }>();
  const { currentJob, loading } = useAppSelector((state) => state.jobs);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isLoginModalVisible, setIsLoginModalVisible] =
    useState<boolean>(false);
  const [isShareModalVisible, setIsShareModalVisible] =
    useState<boolean>(false);

  const customBreadcrumbItems = [
    { path: '/jobs', label: 'Tin tuyển dụng' },
    {
      path: `/job/${id}`,
      label: currentJob?.title || 'Chi tiết công việc',
    },
  ];

  const breadcrumb = useBreadcrumb(customBreadcrumbItems);

  useEffect(() => {
    dispatch(getJobById(id));
  }, [id]);

  const handleIsOpenModal = () => {
    if (!token) {
      setIsLoginModalVisible(true);
    } else {
      setIsOpenModal(true);
    }
  };

  const handleLoginModalOk = () => {
    setIsLoginModalVisible(false);
    navigate(PATH.USER_SIGN_IN);
  };

  if (!currentJob || loading) {
    return (
      <div className="flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {breadcrumb}
      <Row gutter={[16, 16]} className="flex flex-col md:flex-row">
        <Col xs={24} md={16} className="mb-4 md:mb-0">
          <JobHeader
            currentJob={currentJob}
            onShare={() => setIsShareModalVisible(true)}
            onApply={handleIsOpenModal}
          />
          <JobContent currentJob={currentJob} />
        </Col>
        <Col xs={24} md={8} className="hidden md:block">
          <JobSidebar currentJob={currentJob} onApply={handleIsOpenModal} />
        </Col>
      </Row>

      <Modal
        open={isOpenModal}
        footer={null}
        closeIcon={false}
        onCancel={() => setIsOpenModal(false)}
        className="w-full max-w-lg"
      >
        <JobApplicationModal
          jobTitle={currentJob?.title || ''}
          jobId={currentJob?.id}
          handleToggleModal={() => setIsOpenModal(false)}
        />
      </Modal>

      <LoginModal
        isVisible={isLoginModalVisible}
        onCancel={() => setIsLoginModalVisible(false)}
        onOk={handleLoginModalOk}
      />

      <ShareModal
        isVisible={isShareModalVisible}
        onCancel={() => setIsShareModalVisible(false)}
        jobTitle={currentJob?.title}
      />
    </div>
  );
};

export default JobDetail;
