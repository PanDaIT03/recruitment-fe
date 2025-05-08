import { useMutation } from '@tanstack/react-query';
import {
  Card,
  Col,
  Divider,
  Flex,
  Image,
  message,
  Row,
  Space,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { ReactElement, ReactNode, useEffect, useMemo, useState } from 'react';

import { DesiredJobAPI, IGetAllDesiredJob } from '~/apis/desiredJob/desiredJob';
import UserAPI from '~/apis/user';
import {
  AvatarPlaceHolder,
  BackPack,
  BirthDayCalendar,
  Box,
  Calendar,
  CompanyLogo,
  File,
  Link,
  Location,
  Salary,
  SmartPhone,
} from '~/assets/svg';
import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import CopyButton from '~/components/Button/CopyButton';
import Content from '~/components/Content/Content';
import List from '~/components/List/List';
import Spin from '~/components/Loading/Spin';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import useQueryParams from '~/hooks/useQueryParams';
import { advanceOptions } from '~/pages/User/Profile/Modal/LanguageModal';
import { IDesiredJob } from '~/types/DesiredJob';
import {
  IForeignLanguage,
  IUserSkill,
  IWorkExperience,
} from '~/types/User/profile';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

interface InformationItem {
  label: string;
  value: ReactNode;
  icon: ReactElement;
  colSpan?: number;
}

interface IPersonalInformation {
  type?: 'divider';
  items?: InformationItem[];
}

interface IWorkInformation {
  title: string;
  children: ReactElement;
}

const { Title } = Typography;
const { MailOutlined, DownloadOutlined } = icons;

const initSkill = [] as IUserSkill[];
const initialDesiredJob = {} as IDesiredJob;
const initLanguage = [] as IForeignLanguage[];
const initExperience = [] as IWorkExperience[];

const CandidateProfileDetail = () => {
  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();
  const { searchParams } = useQueryParams();

  const [desiredJob, setDesiredJob] = useState(initialDesiredJob);

  const [userSkills, setUserSkills] = useState(initSkill);
  const [workExperiences, setWorkExperiences] = useState(initExperience);
  const [foreignLanguages, setForeignLanguages] = useState(initLanguage);

  const { mutate: getAllDesiredJob, isPending: isGetAllDesiredJobPending } =
    useMutation({
      mutationFn: (params: IGetAllDesiredJob) =>
        DesiredJobAPI.getAllDesiredJob(params),
      onSuccess: (res) => {
        setDesiredJob(res?.items?.[0]);
      },
      onError: (error: any) =>
        message.error(error?.response?.data?.message || 'Có lỗi xảy ra'),
    });

  const {
    mutate: getWorkExperienceByUserId,
    isPending: isWorkExperiencePending,
  } = useMutation({
    mutationFn: (id: number) => UserAPI.getWorkExperienceByUserId(id),
    onSuccess: (res) => setWorkExperiences(res.items),
    onError: (error: any) => {
      message.error(error?.response?.data?.message);
    },
  });

  const { mutate: getLanguageByUserId, isPending: isLanguagePending } =
    useMutation({
      mutationFn: (id: number) => UserAPI.getLanguageByUserId(id),
      onSuccess: (res) => setForeignLanguages(res.items),
      onError: (error: any) => {
        message.error(error?.response?.data?.message);
      },
    });

  const { mutate: getUserSkillByUserId, isPending: isUserSkillPending } =
    useMutation({
      mutationFn: (id: number) => UserAPI.getUserSkillByUserId(id),
      onSuccess: (res) => setUserSkills(res.items),
      onError: (error: any) => {
        message.error(error?.response?.data?.message);
      },
    });

  const personalInfomations: IPersonalInformation[] = useMemo(
    () => [
      {
        items: [
          {
            label: 'Email',
            value: desiredJob?.user?.email,
            icon: <MailOutlined />,
          },
          {
            label: 'SĐT',
            value: desiredJob?.user?.phoneNumber,
            icon: <SmartPhone />,
          },
        ],
      },
      {
        items: [
          {
            label: 'Năm sinh',
            value: desiredJob?.yearOfBirth,
            icon: <BirthDayCalendar />,
          },
          {
            label: 'Mức lương kỳ vọng',
            value: desiredJob?.salarayExpectation,
            icon: <Salary />,
          },
        ],
      },
      {
        items: [
          {
            label: 'Thời gian bắt đầu',
            value: desiredJob?.startAfterOffer,
            icon: <Calendar />,
          },
          {
            label: 'Lĩnh vực',
            value: desiredJob?.jobField?.title,
            icon: <Box />,
          },
        ],
      },
      { type: 'divider' },
      {
        items: [
          {
            label: 'Vị trí',
            value: desiredJob?.desiredJobsPosition
              ?.map((item) => item.jobPosition.title)
              ?.join(', '),
            icon: <BackPack />,
          },
        ],
      },
      {
        items: [
          {
            label: 'Nơi sống hiện tại',
            value: desiredJob?.user?.placement?.title,
            icon: <Location />,
          },
        ],
      },
      {
        items: [
          {
            label: 'Địa điểm làm việc',
            value: desiredJob?.desiredJobsPlacement
              ?.map((item) => item?.placement?.title)
              ?.join(', '),
            icon: <Location />,
            colSpan: 24,
          },
        ],
      },
    ],
    [desiredJob]
  );

  const workInformations: IWorkInformation[] = [
    {
      title: 'Thành tích nổi bật',
      children: (
        <div
          dangerouslySetInnerHTML={{
            __html: desiredJob?.user?.achivement?.description,
          }}
        />
      ),
    },
    {
      title: 'Kinh nghiệm',
      children: (
        <List
          pagination={false}
          dataSource={workExperiences}
          renderItem={(item, index) => (
            <>
              <Flex key={index} gap={12}>
                <CompanyLogo width={60} height={60} className="rounded-full" />
                <Flex vertical justify="center">
                  <p className="font-semibold">{item?.companyName}</p>
                  <Flex>
                    <p className="text-sub">{item?.jobPosition?.title}</p>
                    <p className="text-sub before:content-['•'] before:mx-2 before:text-sm">
                      {`${dayjs(item?.startDate).format('DD/MM/YYYY')} - 
                ${
                  item?.endDate
                    ? dayjs(item?.endDate).format('DD/MM/YYYY')
                    : 'Hiện tại'
                }`}
                    </p>
                  </Flex>
                </Flex>
              </Flex>
              {index < workExperiences?.length - 1 && <Divider />}
            </>
          )}
        />
      ),
    },
    {
      title: 'Ngoại ngữ',
      children: (
        <List
          pagination={false}
          dataSource={foreignLanguages}
          renderItem={({ foreignLanguage, level }, index) => (
            <>
              <Flex key={index} gap={12}>
                <Image
                  width={60}
                  height={60}
                  className="rounded-xl"
                  src={foreignLanguage?.imageUrl}
                />
                <Flex vertical justify="center">
                  <p className="font-semibold">{foreignLanguage?.title}</p>
                  <p className="text-sub">
                    {
                      advanceOptions.find(
                        (option) => option.value === level.toString()
                      )?.label
                    }
                  </p>
                </Flex>
              </Flex>
              {index < foreignLanguages?.length - 1 && <Divider />}
            </>
          )}
        />
      ),
    },
    {
      title: 'Kỹ năng',
      children: (
        <Flex wrap gap={6}>
          {userSkills?.map(({ skill }, index) => (
            <p key={index} className="px-2 py-1 border rounded-md">
              {skill?.title}
            </p>
          ))}
        </Flex>
      ),
    },
  ];

  useEffect(() => {
    setTitle('Chi tiết hồ sơ ứng viên');
    setBreadcrumb([
      { title: 'Phê duyệt' },
      {
        title: 'Hồ sơ ứng viên',
        href: PATH.ADMIN_CANDIDATE_PROFILE_MANAGEMENT,
      },
      { title: 'Chi tiết hồ sơ' },
    ]);
  }, []);

  useEffect(() => {
    const profileId = Number(searchParams?.id);
    const userId = Number(searchParams?.userId);

    getAllDesiredJob({ id: profileId });
    getWorkExperienceByUserId(userId);
    getUserSkillByUserId(userId);
    getLanguageByUserId(userId);
  }, [searchParams]);

  return (
    <Spin spinning={isGetAllDesiredJobPending}>
      <Flex className="w-full px-5 grid grid-cols-10" gap={16}>
        <Space className="col-span-6" classNames={{ item: 'w-full' }}>
          <Space direction="vertical" className="w-full">
            <Content>
              <Space size="middle" direction="vertical" className="w-full">
                <Flex justify="space-between">
                  <Space size="middle" align="start">
                    <AvatarPlaceHolder width={60} height={60} />
                    <Flex vertical>
                      <p className="font-bold text-xl">Dương Đại</p>
                      <p className="text-[#6b6b6b]">
                        daiphucduongvinh203@gmail.com
                      </p>
                    </Flex>
                  </Space>
                  <CopyButton
                    shape="default"
                    title="Sao chép"
                    value=""
                    iconBefore={<Link />}
                  />
                </Flex>
                <Divider className="m-0" />
                <Space
                  size="middle"
                  direction="vertical"
                  className="w-full"
                  classNames={{ item: 'w-full' }}
                >
                  <Title level={3}>Thông tin cá nhân</Title>
                  {personalInfomations.map(({ items, type }) => (
                    <>
                      {type && <Divider className="m-0" />}
                      <Row gutter={[8, 8]} className="px-2" align={'middle'}>
                        {items?.map(({ label, value, icon, colSpan = 12 }) => (
                          <Col span={colSpan}>
                            <Flex gap={8} align="center">
                              <Flex
                                align="center"
                                justify="center"
                                className="p-3 bg-[#f6f6f6] rounded-full"
                              >
                                {icon}
                              </Flex>
                              <Flex vertical>
                                <p className="text-[#6b6b6b]">{label}</p>
                                <p className="font-medium">{value || '-'}</p>
                              </Flex>
                            </Flex>
                          </Col>
                        ))}
                      </Row>
                    </>
                  ))}
                </Space>
              </Space>
            </Content>
            {workInformations?.map(({ title, children }) => (
              <Content>
                <Title level={4}>{title}</Title>
                {children}
              </Content>
            ))}
          </Space>
        </Space>
        <Space direction="vertical" className="col-span-4 h-max">
          <Content>
            <Title level={4}>Resume</Title>
            <Space direction="vertical" className="w-full">
              {desiredJob?.user?.curriculumVitae?.map(
                ({ fileName, url }, index) => (
                  <Flex
                    gap={8}
                    key={index}
                    align="center"
                    justify="space-between"
                  >
                    <Space>
                      <Flex
                        align="center"
                        justify="center"
                        className="p-3 bg-[#f6f6f6] rounded-full"
                      >
                        <File />
                      </Flex>
                      <p className="font-semibold truncate w-72">{fileName}</p>
                    </Space>
                    <ButtonAction
                      tooltipTitle="Tải xuống"
                      title={<DownloadOutlined />}
                    />
                  </Flex>
                )
              )}
            </Space>
          </Content>
        </Space>
      </Flex>
    </Spin>
  );
};

export default CandidateProfileDetail;
