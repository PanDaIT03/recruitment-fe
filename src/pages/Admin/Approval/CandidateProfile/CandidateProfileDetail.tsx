import { useMutation } from '@tanstack/react-query';
import {
  Alert,
  Col,
  Divider,
  Empty,
  Flex,
  Image,
  message,
  Row,
  Space,
  Typography,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import classNames from 'classnames';
import dayjs from 'dayjs';
import {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ApprovalAPI, IApprovalProfile } from '~/apis/approval';
import UserAPI from '~/apis/user';
import { PDF_Icon } from '~/assets/img';
import {
  AvatarPlaceHolder,
  BackPack,
  BirthDayCalendar,
  Box,
  Calendar,
  CompanyLogo,
  Link,
  Location,
  Salary,
  SmartPhone,
  SunRise,
} from '~/assets/svg';
import Button from '~/components/Button/Button';
import CopyButton from '~/components/Button/CopyButton';
import DownloadButton from '~/components/Button/DownloadButton';
import Content from '~/components/Content/Content';
import List from '~/components/List/List';
import Spin from '~/components/Loading/Spin';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import { STATUS_CODE } from '~/enums';
import useQueryParams from '~/hooks/useQueryParams';
import { advanceOptions } from '~/pages/User/Profile/Modal/LanguageModal';
import { IApproval } from '~/types/Approval';
import {
  IForeignLanguage,
  IUserSkill,
  IWorkExperience,
} from '~/types/User/profile';
import { formatCurrencyVN } from '~/utils/functions';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import { IRejectedForm } from './CandidateProfile';
import ModalRejectProfile from './ModalRejectProfile';

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
const { MailOutlined, DownloadOutlined, CheckOutlined, CloseOutlined } = icons;

const initSkill = [] as IUserSkill[];
const initLanguage = [] as IForeignLanguage[];
const initExperience = [] as IWorkExperience[];
const initialCandidateProfile = {} as IApproval;

const CandidateProfileDetail = () => {
  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const { searchParams } = useQueryParams();
  const [rejectedForm] = useForm<IRejectedForm>();

  const [isOpenReasonModal, setIsOpenReasonModal] = useState(false);

  const [userSkills, setUserSkills] = useState(initSkill);
  const [workExperiences, setWorkExperiences] = useState(initExperience);
  const [foreignLanguages, setForeignLanguages] = useState(initLanguage);
  const [candidateProfile, setCandidateProfile] = useState(
    initialCandidateProfile
  );

  const {
    mutate: getCandidateProfile,
    isPending: isGetCandidateProfilePending,
  } = useMutation({
    mutationFn: (id: number) => ApprovalAPI.getCandidateProfileById(id),
    onSuccess: (res) => setCandidateProfile(res),
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

  const { mutate: approveProfile, isPending: isApproveProfilePending } =
    useMutation({
      mutationFn: (params: IApprovalProfile) =>
        ApprovalAPI.approveProfile(params),
      onSuccess: (res) => {
        message.success(res?.message);

        refetchProfile();
        handleCancelRejected();
      },
      onError: (error: any) => {
        message.error(error?.response?.data?.message);
      },
    });

  const isLoading = useMemo(
    () =>
      isGetCandidateProfilePending ||
      isWorkExperiencePending ||
      isLanguagePending ||
      isUserSkillPending,
    [
      isGetCandidateProfilePending,
      isWorkExperiencePending,
      isLanguagePending,
      isUserSkillPending,
    ]
  );

  const isProfileApprove = useMemo(
    () => candidateProfile?.status?.code !== STATUS_CODE.APPROVAL_PENDING,
    [candidateProfile]
  );

  const personalInformation: IPersonalInformation[] = useMemo(
    () => [
      {
        items: [
          {
            label: 'Email',
            value: candidateProfile?.desiredJobSnapshot?.user?.email,
            icon: <MailOutlined />,
          },
          {
            label: 'SĐT',
            value: candidateProfile?.desiredJobSnapshot?.user?.phoneNumber,
            icon: <SmartPhone />,
          },
        ],
      },
      {
        items: [
          {
            label: 'Năm sinh',
            value: candidateProfile?.desiredJobSnapshot?.yearOfBirth,
            icon: <BirthDayCalendar />,
          },
          {
            label: 'Mức lương kỳ vọng',
            value: `${formatCurrencyVN(candidateProfile?.desiredJobSnapshot?.salarayExpectation)} VNĐ`,
            icon: <Salary />,
          },
        ],
      },
      {
        items: [
          {
            label: 'Năm kinh nghiệm',
            value: candidateProfile?.desiredJobSnapshot?.totalYearExperience,
            icon: <SunRise />,
          },
          {
            label: 'Thời gian bắt đầu',
            value: candidateProfile?.desiredJobSnapshot?.startAfterOffer,
            icon: <Calendar />,
          },
        ],
      },
      {
        items: [
          {
            label: 'Chức vụ hiện tại',
            value:
              candidateProfile?.desiredJobSnapshot?.user?.jobPosition?.title,
            icon: <BackPack />,
          },
          {
            label: 'Lĩnh vực',
            value: candidateProfile?.desiredJobSnapshot?.jobField?.title,
            icon: <Box />,
          },
        ],
      },
      {
        items: [
          {
            label: 'Vị trí ứng tuyển',
            value: candidateProfile?.desiredJobSnapshot?.desiredJobsPosition
              ?.map((item) => item?.jobPosition?.title)
              ?.join(', '),
            icon: <BackPack />,
          },
        ],
      },
      { type: 'divider' },
      {
        items: [
          {
            label: 'Nơi sống hiện tại',
            value: candidateProfile?.desiredJobSnapshot?.user?.placement?.title,
            icon: <Location />,
          },
        ],
      },
      {
        items: [
          {
            label: 'Địa điểm làm việc',
            value: candidateProfile?.desiredJobSnapshot?.desiredJobsPlacement
              ?.map((item) => item?.placement?.title)
              ?.join(', '),
            icon: <Location />,
            colSpan: 24,
          },
        ],
      },
    ],
    [candidateProfile]
  );

  const workInformation: IWorkInformation[] = [
    {
      title: 'Thành tích nổi bật',
      children: (
        <div
          dangerouslySetInnerHTML={{
            __html:
              candidateProfile?.desiredJobSnapshot?.user?.achivement
                ?.description,
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
        <>
          {foreignLanguages?.length ? (
            <Space className="flex-wrap">
              {foreignLanguages?.map(({ foreignLanguage, level }, index) => (
                <Flex
                  gap={12}
                  key={index}
                  align="center"
                  className="w-full bg-[#fbfbfb] border px-3 py-2 rounded-xl shadow-sm"
                >
                  <Image
                    width={40}
                    height={40}
                    preview={false}
                    src={foreignLanguage.imageUrl}
                    className="rounded-full object-cover"
                  />
                  <Flex vertical>
                    <p className="font-semibold">{foreignLanguage.title}</p>
                    <p>
                      {
                        advanceOptions.find(
                          (option) => option.value === level.toString()
                        )?.label
                      }
                    </p>
                  </Flex>
                </Flex>
              ))}
            </Space>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </>
      ),
    },
    {
      title: 'Kỹ năng',
      children: (
        <>
          {userSkills?.length ? (
            <Flex wrap gap={12}>
              {userSkills?.map(({ skill }, index) => (
                <p
                  key={index}
                  className="px-2 py-1 border rounded-md shadow-sm"
                >
                  {skill?.title}
                </p>
              ))}
            </Flex>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </>
      ),
    },
  ];

  const refetchProfile = useCallback(() => {
    const profileId = Number(searchParams?.id);
    const userId = Number(searchParams?.userId);

    getLanguageByUserId(userId);
    getUserSkillByUserId(userId);
    getWorkExperienceByUserId(userId);
    getCandidateProfile(profileId);
  }, [searchParams]);

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
    refetchProfile();
  }, [refetchProfile]);

  const handleApprove = useCallback(
    (params: IApprovalProfile) => approveProfile(params),
    []
  );

  const handleFinishRejected = useCallback(
    (values: IRejectedForm) =>
      handleApprove({
        id: candidateProfile?.id,
        rejectReason: values?.reason,
        code: STATUS_CODE.APPROVAL_REJECTED,
      }),
    [candidateProfile]
  );

  const handleCancelRejected = useCallback(() => {
    rejectedForm.resetFields();
    setIsOpenReasonModal(false);
  }, []);

  return (
    <Spin spinning={isLoading}>
      <Space direction="vertical" className="w-full px-5">
        <Flex justify="space-between">
          <Flex gap={4} align="center">
            <p className="text-sub">Trạng thái:</p>
            <p
              className={classNames(
                'font-medium',
                candidateProfile?.status?.code === STATUS_CODE.APPROVAL_APPROVED
                  ? 'text-green-500'
                  : candidateProfile?.status?.code ===
                      STATUS_CODE.APPROVAL_REJECTED
                    ? 'text-red-500'
                    : 'text-blue'
              )}
            >
              {candidateProfile?.status?.title || 'Đang chờ'}
            </p>
          </Flex>
          <Space>
            <Button
              title="Từ chối"
              displayType="error"
              disabled={isProfileApprove}
              iconBefore={<CloseOutlined />}
              onClick={() => setIsOpenReasonModal(true)}
            />
            <Button
              title="Duyệt"
              displayType="approve"
              disabled={isProfileApprove}
              iconBefore={<CheckOutlined />}
              onClick={() =>
                handleApprove({
                  id: candidateProfile?.id,
                  code: STATUS_CODE.APPROVAL_APPROVED,
                })
              }
            />
          </Space>
        </Flex>
        {candidateProfile?.status?.code === STATUS_CODE.APPROVAL_REJECTED && (
          <Alert
            showIcon
            type="error"
            className="bg-[#fffafa]"
            message={
              <p className="text-sm font-bold text-red-500">
                Hồ sơ đã bị từ chối
              </p>
            }
            description={
              <>
                <p>
                  Ngày phê duyệt:{' '}
                  <span className="font-semibold">
                    {candidateProfile?.approveAt
                      ? dayjs(candidateProfile?.approveAt).format(
                          'HH:MM DD/MM/YYYY'
                        )
                      : '-'}
                  </span>
                </p>
                <p>
                  Lý do:{' '}
                  <span className="font-semibold">
                    {candidateProfile?.rejectReason
                      ? candidateProfile?.rejectReason
                      : '-'}
                  </span>
                </p>
              </>
            }
          />
        )}
        <Flex className="w-full grid grid-cols-10" gap={16}>
          <Space className="col-span-6" classNames={{ item: 'w-full' }}>
            <Space direction="vertical" className="w-full">
              <Content>
                <Space size="middle" direction="vertical" className="w-full">
                  <Flex justify="space-between">
                    <Space size="middle" align="start">
                      {candidateProfile?.desiredJobSnapshot?.user?.avatarUrl ? (
                        <Image
                          width={60}
                          height={60}
                          className="rounded-full"
                          src={
                            candidateProfile?.desiredJobSnapshot?.user
                              ?.avatarUrl
                          }
                        />
                      ) : (
                        <AvatarPlaceHolder width={60} height={60} />
                      )}
                      <Flex vertical>
                        <p className="font-bold text-xl">
                          {candidateProfile?.desiredJobSnapshot?.user?.fullName}
                        </p>
                        <p className="text-[#6b6b6b]">
                          {candidateProfile?.desiredJobSnapshot?.user?.email}
                        </p>
                      </Flex>
                    </Space>
                    <CopyButton
                      value=""
                      shape="default"
                      title="Sao chép"
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
                    {personalInformation.map(({ items, type }, index) => (
                      <div key={index}>
                        {type && <Divider className="m-0" />}
                        <Row gutter={[8, 8]} className="px-2" align={'middle'}>
                          {items?.map(
                            (
                              { label, value, icon, colSpan = 12 },
                              childIndex
                            ) => (
                              <Col span={colSpan} key={childIndex}>
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
                                    <p className="font-medium">
                                      {value || '-'}
                                    </p>
                                  </Flex>
                                </Flex>
                              </Col>
                            )
                          )}
                        </Row>
                      </div>
                    ))}
                  </Space>
                </Space>
              </Content>
              {workInformation?.map(({ title, children }, index) => (
                <Content key={index}>
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
                {candidateProfile?.desiredJobSnapshot?.user?.curriculumVitae?.map(
                  ({ fileName, url }, index) => (
                    <Flex
                      gap={8}
                      key={index}
                      align="center"
                      justify="space-between"
                    >
                      <Space
                        className="cursor-pointer hover:text-[#F15224] transition-all"
                        onClick={() => window.open(url, '_blank')}
                      >
                        <Image
                          width={24}
                          height={24}
                          preview={false}
                          src={PDF_Icon}
                        />
                        <p className="font-semibold truncate w-72">
                          {fileName}
                        </p>
                      </Space>
                      <DownloadButton
                        url={url}
                        fileName={fileName}
                        title={<DownloadOutlined />}
                      />
                    </Flex>
                  )
                )}
              </Space>
            </Content>
            <Content>
              <Title level={4}>Lịch sử phê duyệt</Title>
              <Space direction="vertical" className="w-full"></Space>
            </Content>
          </Space>
        </Flex>
      </Space>
      <ModalRejectProfile
        form={rejectedForm}
        isOpen={isOpenReasonModal}
        loading={isApproveProfilePending}
        onCancel={handleCancelRejected}
        onFinish={handleFinishRejected}
      />
    </Spin>
  );
};

export default CandidateProfileDetail;
