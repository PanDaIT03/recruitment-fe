import { Divider, Flex, Image, List, Skeleton } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom';
import { JobsAPI } from '~/apis/job';

import { EmptyFolder } from '~/assets/img';
import { Lightning } from '~/assets/svg';
import Button from '~/components/Button/Button';
import { useFetch } from '~/hooks/useFetch';
import { mockFileList } from '~/mocks/data';
import { IUserAppliedJob } from '~/types/Job';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { ArrowRightOutlined } = icons;
const defaultImgUrl = mockFileList[0].url;

const AppliedJob = () => {
  const navigate = useNavigate();

  const { data: appliedJobs, isPending } = useFetch(
    ['getUserAppliedJobs'],
    JobsAPI.getUserAppliedJobs
  );

  return (
    <>
      <Flex align="center" gap={8}>
        <Lightning width={18} height={18} />
        <h2 className="text-base font-bold">
          Ứng tuyển của bạn ({appliedJobs?.items.length})
        </h2>
      </Flex>
      <Divider className="!my-3" />
      {appliedJobs?.items.length ? (
        <List
          itemLayout="vertical"
          dataSource={
            isPending
              ? ([1] as unknown as IUserAppliedJob[])
              : appliedJobs.items
          }
          renderItem={(item) =>
            isPending ? (
              <List.Item>
                <Skeleton avatar active title={false} paragraph={{ rows: 2 }} />
              </List.Item>
            ) : (
              <List.Item className="!border-0">
                <List.Item.Meta
                  avatar={
                    <Image
                      width={64}
                      height={64}
                      preview={false}
                      src={defaultImgUrl}
                      className="rounded-lg"
                    />
                  }
                  title={
                    <Link
                      to={`/job/${item.jobsId}`}
                      className="font-medium hover:!text-primary hover:underline"
                    >
                      {item?.job?.title}
                    </Link>
                  }
                  description={
                    <Flex vertical>
                      <span className="text-primary">
                        Viện Thẩm Mỹ Quốc Tế Mega Korea
                      </span>
                      <span>
                        Đã ứng tuyển vào lúc{' '}
                        {dayjs(item?.createAt).format('HH:mm DD/MM/YYYY')}
                      </span>
                    </Flex>
                  }
                />
              </List.Item>
            )
          }
        />
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
