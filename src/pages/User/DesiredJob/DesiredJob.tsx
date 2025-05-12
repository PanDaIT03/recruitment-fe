import { Divider, Flex, Image, Skeleton, Space, Tag } from 'antd';
import { useForm } from 'antd/es/form/Form';
import Paragraph from 'antd/es/typography/Paragraph';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DesiredJobAPI } from '~/apis/desiredJob';
import { NetWorking } from '~/assets/img';
import { Work } from '~/assets/svg';
import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Modal from '~/components/Modal/Modal';
import TextArea from '~/components/TextArea/TextArea';
import { STATUS_CODE } from '~/enums';
import { PERMISSION } from '~/enums/permissions';
import useDocumentTitle from '~/hooks/useDocumentTitle';
import { useFetch } from '~/hooks/useFetch';
import { usePermission } from '~/hooks/usePermission';
import { formatSalary } from '~/utils/functions';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import PingIcon from './components/PingIcon';
import ModalDesiredJob from './ModalDesiredJob';

interface IDesiredJobInfo {
  title: string;
  content: ReactNode;
}

interface IReasonForm {
  reason: string;
}

const { PlusOutlined, EditOutlined } = icons;

const DesiredJob = () => {
  const navigate = useNavigate();
  const { setDocTitle } = useDocumentTitle();

  const [reasonForm] = useForm<IReasonForm>();
  const { hasPermissions } = usePermission(PERMISSION.EDIT_DESIRED_JOB);

  const [isOpenReasonModal, setIsOpenReasonModal] = useState(false);
  const [isOpenDesiredJobModal, setIsOpenDesiredJobModal] = useState(false);

  const {
    refetch,
    isPending,
    data: desiredJob,
  } = useFetch(['getDesiredJob'], DesiredJobAPI.getDesiredJob);

  const profile = useMemo(
    () => ({
      isHasDesiredJob: desiredJob && Object.keys(desiredJob).length > 1,
      isRejected: desiredJob?.status?.code === STATUS_CODE.APPROVAL_REJECTED,
      isApproved: desiredJob?.status?.code === STATUS_CODE.APPROVAL_APPROVED,
    }),
    [desiredJob]
  );

  const desiredJobInfo: IDesiredJobInfo[] = useMemo(() => {
    return [
      {
        title: 'Lĩnh vực',
        content: desiredJob?.jobField?.title,
      },
      {
        title: 'Vị trí ứng tuyển',
        content: desiredJob?.desiredJobsPosition?.map((jobPosition, index) => (
          <Tag key={index} color="magenta">
            {jobPosition?.jobPosition?.title}
          </Tag>
        )),
      },
      {
        title: 'Địa điểm',
        content: desiredJob?.desiredJobsPlacement
          ?.map((jobPlacement) => jobPlacement?.placement?.title)
          .join(', '),
      },
      {
        title: 'Mức lương kỳ vọng',
        content: (
          <Tag color="green">
            {formatSalary(0, desiredJob?.salarayExpectation)}
          </Tag>
        ),
      },
      {
        title: 'Thời gian bắt đầu',
        content: desiredJob?.startAfterOffer,
      },
    ];
  }, [desiredJob]);

  useEffect(() => {
    setDocTitle('Công việc mong muốn | Đúng người đúng việc');
  }, []);

  const handleCancel = useCallback(() => {
    setIsOpenDesiredJobModal(false);
  }, []);

  const handleEditProfile = useCallback(() => {
    setIsOpenReasonModal(false);
    setIsOpenDesiredJobModal(true);
  }, []);

  const handleOpenReasonModal = useCallback(() => {
    reasonForm.setFieldValue('reason', desiredJob?.rejectReason);
    setIsOpenReasonModal(true);
  }, [desiredJob]);

  const handleCloseReasonModal = useCallback(() => {
    reasonForm.resetFields();
    setIsOpenReasonModal(false);
  }, []);

  return (
    <>
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={8}>
          <Work />
          <h2 className="text-base font-bold">Công việc mong muốn</h2>
        </Flex>
        {hasPermissions && profile.isHasDesiredJob && (
          <ButtonAction
            tooltipTitle="Cập nhật"
            title={<EditOutlined className="text-[#691f74] cursor-pointer" />}
            onClick={() => setIsOpenDesiredJobModal(true)}
          />
        )}
      </Flex>
      <Divider className="!my-3" />
      {isPending ? (
        <>
          <Skeleton active title={false} paragraph={{ rows: 5 }} />
          <Divider dashed className="!m-3" />
          <Skeleton active title={false} paragraph={{ rows: 1 }} />
        </>
      ) : profile.isHasDesiredJob ? (
        <>
          <Space direction="vertical" className="w-full p-2" size="middle">
            {desiredJobInfo.map((item, index) => (
              <Flex
                key={index}
                justify="space-between"
                className="max-sm:flex-col sm:items-center"
              >
                <p className="text-sm text-sub leading-6 font-medium">
                  {item.title}
                </p>
                <p className="text-sm font-medium">{item.content}</p>
              </Flex>
            ))}
          </Space>
          <Divider dashed className="!m-3" />
          <Flex
            justify="space-between"
            className="px-2 pb-4 pt-2 max-sm:flex-col"
          >
            <p className="text-sm text-sub leading-6 font-medium">
              Trạng thái chia sẻ
            </p>
            <Flex gap={8} align="center" className="sm:justify-center">
              {profile.isRejected ? (
                <Space direction="vertical" className="sm:items-end">
                  <Flex gap={8} align="center" className="sm:justify-center">
                    <PingIcon status="error" />
                    <p className="text-sm text-red-500 font-medium">
                      Hồ sơ đã bị từ chối
                    </p>
                  </Flex>
                  <Button
                    title="Xem lý do"
                    displayType="text"
                    className="text-blue underline hover:opacity-60"
                    onClick={handleOpenReasonModal}
                  />
                </Space>
              ) : (
                <Flex gap={8} align="center" className="sm:justify-center">
                  <PingIcon
                    status={profile.isApproved ? 'success' : 'pending'}
                  />
                  <p
                    className={classNames(
                      'text-sm font-medium',
                      profile.isApproved ? 'text-lime-500' : 'text-blue'
                    )}
                  >
                    {profile.isApproved
                      ? `Chia sẻ vào ${dayjs(desiredJob?.approveAt).format('HH:mm DD/MM/YYYY')}`
                      : 'Đang chờ phê duyệt'}
                  </p>
                </Flex>
              )}
            </Flex>
          </Flex>
        </>
      ) : (
        <Flex vertical align="center" justify="center" className="gap-4">
          <Image
            width={112}
            height={112}
            preview={false}
            src={NetWorking}
            className="rounded-full p-4 bg-gray-100"
          />
          <Paragraph className="text-center text-sm text-sub italic max-w-md">
            Tạo hồ sơ tìm việc để kết nối với Nhà tuyển dụng
          </Paragraph>
          <Button
            fill
            title="Khởi tạo"
            iconBefore={<PlusOutlined />}
            onClick={() => navigate(PATH.USER_JOB_APPLICATION)}
          />
        </Flex>
      )}
      <Modal
        title="Lý do từ chối"
        isOpen={isOpenReasonModal}
        footer={
          <Flex gap={8} align="center" justify="end">
            <Button title="Đóng" onClick={() => reasonForm.submit()} />
            <Button fill title="Chỉnh sửa hồ sơ" onClick={handleEditProfile} />
          </Flex>
        }
        onCancel={handleCloseReasonModal}
      >
        <FormWrapper form={reasonForm} onFinish={handleCloseReasonModal}>
          <FormItem
            name="reason"
            extra="Rất tiếc, hồ sơ công việc của bạn đã bị từ chối. Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ"
          >
            <TextArea readOnly />
          </FormItem>
        </FormWrapper>
      </Modal>
      <ModalDesiredJob
        data={desiredJob}
        isOpen={isOpenDesiredJobModal}
        refetch={refetch}
        onCancel={handleCancel}
        setIsOpen={setIsOpenDesiredJobModal}
      />
    </>
  );
};

export default DesiredJob;
