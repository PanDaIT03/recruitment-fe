import { Flex, Skeleton, Space } from 'antd';
import { Dispatch, memo, SetStateAction } from 'react';

import { Calendar, Lightning, Salary, Telephone } from '~/assets/svg';
import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import { JobItem } from '~/types/Job';
import icons from '~/utils/icons';

type IProps = Pick<JobItem, 'user' | 'title' | 'applicationDeadline'> & {
  salary: string;
  placements: string;
  loading?: boolean;
  setIsOpenShareModal: Dispatch<SetStateAction<boolean>>;
  setIsOpenContactModal: Dispatch<SetStateAction<boolean>>;
  setIsOpenJobApplyModal: Dispatch<SetStateAction<boolean>>;
};

const { EnvironmentOutlined, ShareAltOutlined } = icons;

const JobHeader = ({
  user,
  title,
  salary,
  placements,
  loading,
  applicationDeadline,
  setIsOpenShareModal,
  setIsOpenContactModal,
  setIsOpenJobApplyModal,
}: IProps) => {
  return (
    <Flex gap={16} justify="space-between" className="max-lg:flex-col">
      {loading ? (
        <Skeleton active title paragraph={{ rows: 1 }} />
      ) : (
        <Space direction="vertical" className="w-full">
          <h1 className="text-2xl font-bold">{title}</h1>
          <Flex
            wrap
            gap={8}
            align="center"
            className="h4 text-center text-sub text-xsm font-medium leading-4"
          >
            <div className="text-[#000000E0] pr-2 border-r border-neutral-400">
              <span>{user?.companyName}</span>
            </div>
            <Flex gap={8} className="pr-2 border-r border-neutral-400">
              <EnvironmentOutlined />
              <span className="text-start">{placements}</span>
            </Flex>
            <Flex
              gap={8}
              className="text-accent pr-2 border-r border-neutral-400"
            >
              <Salary />
              <span>{salary}</span>
            </Flex>
            <Flex gap={8}>
              <Calendar />
              <span>{applicationDeadline}</span>
            </Flex>
          </Flex>
        </Space>
      )}
      <Flex gap={8}>
        <ButtonAction
          title={<Telephone />}
          tooltipTitle="Xem thông tin liên hệ"
          className="w-9 h-9 text-accent text-base max-md:hidden"
          onClick={() => setIsOpenContactModal(true)}
        />
        <ButtonAction
          tooltipTitle="Chia sẻ"
          title={<ShareAltOutlined />}
          className="w-9 h-9 text-accent text-base max-md:hidden"
          onClick={() => setIsOpenShareModal(true)}
        />
        <Button
          fill
          title="Ứng tuyển ngay"
          iconBefore={<Lightning />}
          className="w-full md:w-auto"
          onClick={() => setIsOpenJobApplyModal(true)}
        />
      </Flex>
    </Flex>
  );
};

export default memo(JobHeader);
