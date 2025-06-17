import { Flex, Radio, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { JobsAPI } from '~/apis/job';
import { BackPack, Box } from '~/assets/svg';
import FormItem from '~/components/Form/FormItem';
import DrawerSearch from '~/components/Search/DrawerSearch';
import TopSearchBar from '~/components/Search/TopSearchBar';
import CustomSelect from '~/components/Select/CustomSelect';
import Select from '~/components/Select/Select';
import { useMessage } from '~/contexts/MessageProvider';
import useDocumentTitle from '~/hooks/useDocumentTitle';
import { useFetch } from '~/hooks/useFetch';
import { useAppSelector } from '~/hooks/useStore';
import { IJobSeeker } from '~/types/JobSeeker/JobSeeker';
import Achievement from './components/Achievement/Achievement';
import CandidateInfo from './components/CandidateInfo/CandidateInfo';
import Experience from './components/Experience/Experience';
import SectionJobSeeker from './SectionJobSeeker';
import TableJobSeeker from './TableJobSeeker/TableJobSeeker';
import usePagination from '~/hooks/usePagination';
import { getAllDesiredJob } from '~/store/thunk/desiredJob';

const optionsExperience: DefaultOptionType[] = [
  {
    label: 'Tất cả kinh nghiệm',
    value: 'all',
  },
  {
    label: 'Dưới 1 năm',
    value: 'less than 1 year',
  },
  {
    label: '1-3 năm',
    value: '1-3 year',
  },
];

const defaultFieldOptions: DefaultOptionType[] = [
  {
    label: 'Tất cả lĩnh vực',
    value: 'all',
  },
];

const data: IJobSeeker[] = [
  {
    key: '1',
    age: 20,
    name: 'Lệ Tr****',
    timePosted: '14 giờ trước',
    location: 'Hồ Chí Minh',
    field: 'Quảng cáo/ Truyền thông/ Marketing',
    position: [
      'Content Creator',
      'Livestreamer',
      'Thực Tập Sinh Tổ Chức Sự Kiện',
    ],
    experience: '< 1 năm',
    salary: 2000000000,
    startDate: 'Bắt đầu ngay',
    requirements:
      'Sinh viên năm cuối chuyên ngành thiết kế đồ họa\nYêu thích và mong muốn gắn bó với lâu dài với công việc thiết kế\nTìm kiếm được vị trí thực tập phù hợp trong lĩnh vực thiết kế đồ họa\nHoàn thành tốt kỳ thực tập và khẳng định bản thân bằng cách trở thành nhân viên chính thức của Công ty',
  },
  {
    key: '2',
    age: 20,
    name: 'Nhi Tr****',
    timePosted: '14 giờ trước',
    location: 'Hồ Chí Minh',
    field: 'HCNS/Trợ lý/Tuyển dụng/Văn phòng',
    position: [
      'Office Manager',
      'Admin Manager/ Leader',
      'Cộng Tác Viên Tuyển Dụng Online',
    ],
    experience: '< 1 năm',
    salary: 15000000000,
    startDate: 'Bắt đầu ngay',
    requirements:
      'Gia sư Tiếng Anh online, Gia sư Trí Thức | 4/2023 - 7/2024: Nhận lớp gia sư online thông qua trung tâm Gia sư Trí Thức và dạy gia sư môn Tiếng Anh. Liên hệ, trao đổi với phụ huynh và học sinh để xác nhận thông tin lớp học, nhận lớp, dạy thử.\nPhó ban Nhân sự CLB Thương mại\nXây dựng và quản lý 3 tài khoản Tik Tok cá nhân với hơn 80.000 followers và 4.000.000 likes.',
  },
];

const JobSeeker = () => {
  const [form] = useForm();
  const { messageApi } = useMessage();
  const { setDocTitle } = useDocumentTitle();

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [filterParams, setFilterParams] = useState();
  
  const { role } = useAppSelector((state) => state.auth.currentUser);

  const {} = usePagination({
    fetchAction: getAllDesiredJob,
    setFilterParams
  });
  
  const { data: jobFields } = useFetch(
    ['allJobsFields'],
    JobsAPI.getAllJobFields
  );

  const jobFieldOptions = useMemo(() => {
    if (!jobFields?.items.length) return defaultFieldOptions;

    const jobFieldItems: DefaultOptionType[] = jobFields?.items.map(
      (jobField) => ({
        label: jobField.title,
        value: jobField.id,
      })
    );

    return [...jobFieldItems, ...defaultFieldOptions];
  }, [jobFields]);

  useEffect(() => {
    handleInitForm();
    setDocTitle('Danh sách ứng viên | Đúng người đúng việc');
  }, []);

  const handleInitForm = () => {
    form.setFieldsValue({ experience: 'all', field: 'all' });
  };

  const handleSearch = (values: any) => {
    console.log(values);
  };

  const handleClickDownloadProfile = () => {
    return role?.id === 3
      ? console.log('click')
      : messageApi.warning(
          'Bạn cần phải là nhà tuyển dụng mới được tải hồ sơ ứng viên'
        );
  };

  const handleResetFilters = useCallback(() => {
    // form.resetFields();
    // form.setFieldValue('placementIds', 'all');
    // handlePageChange(1);
    // hanldeClearURLSearchParams();
    // setFilters({ ...defaultFilter });
  }, []);

  const columns: ColumnsType<IJobSeeker> = [
    {
      key: 'name',
      width: '25%',
      dataIndex: 'name',
      title: 'Thông tin ứng viên',
      render: (_, record: IJobSeeker) => (
        <CandidateInfo
          data={record}
          onDownLoadProfile={handleClickDownloadProfile}
        />
      ),
    },
    {
      width: '40%',
      key: 'experience',
      title: 'Nguyện vọng & kinh nghiệm',
      render: (record: IJobSeeker) => {
        const keys = ['field', 'position', 'experience', 'salary', 'startDate'];
        return <Experience keys={keys} data={record} />;
      },
    },
    {
      key: 'requirements',
      dataIndex: 'requirements',
      title: 'Thành tích/kỹ năng nổi bật',
      render: (value: string) => <Achievement value={value} />,
    },
  ];

  return (
    <div className="min-h-[100vh]">
      <TopSearchBar
        form={form}
        placeHolder="Tìm kiếm theo vị trí ứng tuyển"
        onSearch={handleSearch}
        onClear={handleResetFilters}
        onPageChange={() => {}}
        onSetFormValues={() => {}}
        setIsDrawerSearchOpen={setIsOpenDrawer}
      >
        <FormItem name="experience" className="w-full h-10 max-w-48 mb-0">
          <CustomSelect
            showSearch={false}
            displayedType="text"
            className="w-full h-full"
            prefixIcon={<BackPack />}
            options={optionsExperience}
          />
        </FormItem>
        <FormItem name="field" className="w-full h-10 max-w-44 mb-0">
          <CustomSelect
            showSearch={false}
            prefixIcon={<Box />}
            displayedType="text"
            className="w-full h-full"
            options={jobFieldOptions}
          />
        </FormItem>
      </TopSearchBar>

      <DrawerSearch
        form={form}
        open={isOpenDrawer}
        title="Lọc ứng viên"
        onFilter={handleSearch}
        onCancel={handleInitForm}
        onPageChange={() => {}}
        onSetFormValues={() => {}}
        setIsOpenDrawer={setIsOpenDrawer}
      >
        <FormItem name="field" label="Lĩnh vực">
          <Select allowClear placeholder="Lĩnh vực" options={jobFieldOptions} />
        </FormItem>
        <FormItem name="experience" label="Kinh nghiệm">
          <Radio.Group>
            <Flex vertical gap={16}>
              {optionsExperience.map(({ value, label }) => (
                <Radio key={value} value={value}>
                  {label}
                </Radio>
              ))}
            </Flex>
          </Radio.Group>
        </FormItem>
      </DrawerSearch>

      <Space
        size="middle"
        direction="vertical"
        className="container mx-auto px-4 pt-4 pb-8 max-w-[1600px] lg:px-8"
      >
        <div>
          <h2 className="text-base font-semibold">
            Có <span className="text-accent">2</span> ứng viên đang tìm việc
          </h2>
          <div className="text-sm text-sub font-medium">
            Tất cả ứng viên được chia sẻ miễn phí
          </div>
        </div>
        <TableJobSeeker<IJobSeeker>
          columns={columns}
          dataSource={data}
          className="hidden lg:block"
        />
        <SectionJobSeeker
          data={data}
          className="block lg:hidden"
          onDownLoadProfile={handleClickDownloadProfile}
        />
      </Space>
    </div>
  );
};

export default JobSeeker;
