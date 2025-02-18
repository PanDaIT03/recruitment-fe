import { Divider, Flex, Image, Skeleton, Space, Tag } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import dayjs from 'dayjs';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DesiredJobAPI } from '~/apis/desiredJob/desiredJob';
import { NetWorking } from '~/assets/img';
import { Work } from '~/assets/svg';
import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import useDocumentTitle from '~/hooks/useDocumentTitle';
import { useFetch } from '~/hooks/useFetch';
import { formatSalary } from '~/utils/functions';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import PingIcon from './components/PingIcon';
import ModalDesiredJob from './ModalDesiredJob';

interface IDesiredJobInfo {
  title: string;
  content: ReactNode;
}

const { PlusOutlined, EditOutlined } = icons;

const DesiredJob = () => {
  const navigate = useNavigate();
  const { setDocTitle } = useDocumentTitle();

  const [isOpen, setIsOpen] = useState(false);

  const {
    refetch,
    isPending,
    data: desiredJob,
  } = useFetch(['getDesiredJob'], DesiredJobAPI.getDesiredJob);

  const isHasDesiredJob = useMemo(
    () => desiredJob && Object.keys(desiredJob).length > 1,
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
    setIsOpen(false);
  }, []);

  return (
    <>
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={8}>
          <Work />
          <h2 className="text-base font-bold">Công việc mong muốn</h2>
        </Flex>
        {isHasDesiredJob && (
          <ButtonAction
            tooltipTitle="Cập nhật"
            title={<EditOutlined className="text-[#691f74] cursor-pointer" />}
            onClick={() => setIsOpen(true)}
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
      ) : isHasDesiredJob ? (
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
            className="px-2 pb-4 pt-2 max-sm:flex-col sm:items-center"
          >
            <p className="text-sm text-sub leading-6 font-medium">
              Trạng thái chia sẻ
            </p>
            <Flex gap={8} align="center" className="sm:justify-center">
              <PingIcon status="success" />
              <p className="text-sm text-lime-500 font-medium">
                Chia sẻ vào{' '}
                {dayjs(desiredJob?.createAt).format('HH:mm DD/MM/YYYY')}
              </p>
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
      <ModalDesiredJob
        isOpen={isOpen}
        data={desiredJob}
        refetch={refetch}
        setIsOpen={setIsOpen}
        onCancel={handleCancel}
      />
    </>
  );
};

export default DesiredJob;
