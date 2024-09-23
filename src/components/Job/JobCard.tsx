import { Card, Col, Row, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import { Link } from 'react-router-dom';
import { IJob } from '~/types/Job';
import icons from '~/utils/icons';
import Button from '../Button/Button';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Paragraph } = Typography;

const {
  DollarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  AccountBookOutlined,
  ArrowRightOutlined,
  ReconciliationOutlined,
} = icons;

const JobHeader: React.FC<
  Pick<IJob, 'id' | 'title' | 'user' | 'jobPosition'>
> = ({ id, title, user, jobPosition }) => (
  <Row className="flex items-start gap-4 mb-3">
    <Col className="flex-shrink-0 w-12 h-12 mt-1">
      <img
        alt={title}
        src={user.avatarUrl || 'default-avatar.png'}
        className="rounded-md object-contain w-full h-full"
      />
    </Col>
    <Row>
      <Col span={24}>
        <Link to={`/job/${id}`} target="_blank" className="text-xl text-black">
          {title}
        </Link>
      </Col>
      <Col span={24}>
        <Typography className="text-md text-blue-300">
          {user?.companyName}
        </Typography>
      </Col>
      <Col span={24}>
        <Typography className="text-md text-[#78726de6]">
          {jobPosition?.title}
        </Typography>
      </Col>
    </Row>
  </Row>
);

const JobTags: React.FC<{
  totalAmount: number;
  priceRange: string;
  jobCategory: IJob['jobCategory'];
  workType: IJob['workType'];
}> = ({ totalAmount, priceRange, jobCategory, workType }) => (
  <Row className="flex items-center gap-2 text-sm text-gray-200 mb-3">
    <Tag icon={<ReconciliationOutlined />} color="purple">
      {workType.title}
    </Tag>
    <Tag icon={<EnvironmentOutlined />} color="red">
      {jobCategory?.name}
    </Tag>
    <Tag icon={<DollarOutlined />} color="green">
      {priceRange}
    </Tag>
    <Tag icon={<TeamOutlined />} color="blue">
      {totalAmount}
    </Tag>
  </Row>
);

const JobCard: React.FC<IJob> = (job) => {
  const totalAmount =
    job.jobsPlacements?.reduce((sum, placement) => sum + placement.amount, 0) ||
    0;
  const priceRange =
    job.startPrice && job.endPrice
      ? `${job.startPrice} - ${job.endPrice}`
      : job.startPrice
        ? ` ${job.startPrice}`
        : job.endPrice
          ? ` ${job.endPrice}`
          : 'Thương lượng';

  return (
    <Card
      hoverable
      className="border border-gray-200 hover:border-primary shadow-sm rounded-lg p-4"
    >
      <div className="flex flex-col">
        <JobHeader
          id={job.id}
          title={job.title}
          user={job.user}
          jobPosition={job.jobPosition}
        />
        <JobTags
          totalAmount={totalAmount}
          priceRange={priceRange}
          jobCategory={job.jobCategory}
          workType={job.workType}
        />
        <Paragraph className="text-sm text-[#78726de6] mb-0 line-clamp-2">
          {job.description}
        </Paragraph>
        <Row className="flex items-center justify-between mb-0">
          <Col>
            <Tag icon={<AccountBookOutlined />} color="geekblue">
              {dayjs(job.createAt).fromNow()}
            </Tag>
          </Col>
          <Link to={`/job/${job.id}`} target="_blank">
            <Col className="flex items-center gap-2">
              <Button
                displayType="text"
                title="Xem chi tiết"
                className="text-[#2563eb] hover:underline hover:text-[#2563eb]"
              />
              <span>
                <ArrowRightOutlined style={{ color: '#2563eb' }} />
              </span>
            </Col>
          </Link>
        </Row>
      </div>
    </Card>
  );
};
export default JobCard;
