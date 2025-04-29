import { Avatar, Divider, Flex, Image, Skeleton, Space } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { JobsAPI } from '~/apis/job';
import { EmptyFolder } from '~/assets/img';
import { Lightning } from '~/assets/svg';
import Button from '~/components/Button/Button';
import useDocumentTitle from '~/hooks/useDocumentTitle';
import { useFetch } from '~/hooks/useFetch';
import { defaultImgUrl } from '~/utils/constant';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { ArrowRightOutlined } = icons;

const AppliedJob = () => {
  const navigate = useNavigate();
  const { setDocTitle } = useDocumentTitle();

  const { data: appliedJobs, isPending } = useFetch(
    ['getUserAppliedJobs'],
    JobsAPI.getUserAppliedJobs
  );

  useEffect(() => {
    setDocTitle('Công việc đã ứng tuyển | Đúng người đúng việc');
  }, []);

  return (
    <>
      <Flex align="center" gap={8}>
        <Lightning width={18} height={18} />
        <h2 className="text-base font-bold">
          Ứng tuyển của bạn ({appliedJobs?.items.length})
        </h2>
      </Flex>
      <Divider className="!my-3" />
      {isPending ? (
        <Skeleton avatar active title={false} paragraph={{ rows: 2 }} />
      ) : appliedJobs?.items.length ? (
        <Flex vertical gap={20}>
          {appliedJobs?.items.map((item) => (
            <Flex gap={12}>
              <Avatar
                shape="square"
                className="w-16 h-16 min-w-16"
                src={item.job.user.avatarUrl || defaultImgUrl}
              />
              <Space direction="vertical" size="small">
                <Link
                  target="_blank"
                  to={`/job/${item.jobsId}`}
                  className="text-base font-medium hover:!text-primary hover:underline"
                >
                  {item.job.title}
                </Link>
                <div>
                  <p className="font-medium">{item.job.user.companyName}</p>
                  <p className="text-sub">
                    Đã ứng tuyển vào lúc:{' '}
                    {dayjs(item.createAt).format('HH:mm DD/MM/YYYY')}
                  </p>
                </div>
              </Space>
            </Flex>
          ))}
        </Flex>
      ) : (
        <Flex vertical align="center" justify="center" className="gap-4">
          <Image
            width={112}
            height={112}
            preview={false}
            src={EmptyFolder}
            className="rounded-full p-4 bg-gray-100"
          />
          <Paragraph className="text-center text-sm text-sub italic max-w-md">
            Tạo hồ sơ tìm việc để kết nối với Nhà tuyển dụng
          </Paragraph>
          <Button
            fill
            title="Xem danh sách công việc"
            iconAfter={<ArrowRightOutlined />}
            onClick={() => navigate(PATH.JOB_LIST)}
          />
        </Flex>
      )}
    </>
  );
};

export default AppliedJob;
