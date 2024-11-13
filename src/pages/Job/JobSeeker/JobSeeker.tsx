import { Flex, message, Radio, Space, Table, Tag } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { DesiredJobAPI } from '~/apis/desiredJob/desiredJob';
import { BackPack, Box } from '~/assets/svg';
import Button from '~/components/Button/Button.tsx';
import FormItem from '~/components/Form/FormItem';
import DrawerSearch from '~/components/Search/DrawerSearch';
import TopSearchBar from '~/components/Search/TopSearchBar';
import CustomSelect from '~/components/Select/CustomSelect';
import Select from '~/components/Select/Select';
import { useFetch } from '~/hooks/useFetch';
import { useAppSelector } from '~/hooks/useStore.ts';
import icons from '~/utils/icons';

const { EnvironmentOutlined, ClockCircleOutlined } = icons;

interface JobListing {
  key: string;
  name: string;
  timePosted: string;
  location: string;
  age: number;
  field: string;
  position: string;
  experience: string;
  salary: string;
  startDate: string;
  requirements: string[];
}

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

const JobSeeker = () => {
  const [form] = useForm();
  const { role } = useAppSelector((state) => state.auth.currentUser);

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string[]>([]);

  const { data: jobFields } = useFetch(
    ['allJobsFields'],
    DesiredJobAPI.getAllJobFields
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
  }, []);

  const toggleExpand = (key: string) => {
    setExpandedRow((prevExpandedRows) =>
      prevExpandedRows.includes(key)
        ? prevExpandedRows.filter((rowKey) => rowKey !== key)
        : [...prevExpandedRows, key]
    );
  };

  const data: JobListing[] = [
    {
      key: '1',
      name: 'Lệ Tr****',
      timePosted: '14 giờ trước',
      location: 'Hồ Chí Minh',
      age: 20,
      field: 'Quảng cáo/ Truyền thông/ Marketing',
      position: 'Thực Tập Sinh Tổ Chức Sự Kiện',
      experience: '< 1 năm',
      salary: 'Xem mức lương',
      startDate: 'Bắt đầu ngay',
      requirements: [
        'Sinh viên năm cuối chuyên ngành thiết kế đồ họa',
        'Yêu thích và mong muốn gắn bó với lâu dài với công việc thiết kế',
        'Tìm kiếm được vị trí thực tập phù hợp trong lĩnh vực thiết kế đồ họa',
        'Hoàn thành tốt kỳ thực tập và khẳng định bản thân bằng cách trở thành nhân viên chính thức của Công ty',
      ],
    },
    {
      key: '2',
      name: 'Nhi Tr****',
      timePosted: '14 giờ trước',
      location: 'Hồ Chí Minh',
      age: 20,
      field: 'HCNS/Trợ lý/Tuyển dụng/Văn phòng',
      position: 'Cộng Tác Viên Tuyển Dụng Online',
      experience: '< 1 năm',
      salary: 'Xem mức lương',
      startDate: 'Bắt đầu ngay',
      requirements: [
        'Gia sư Tiếng Anh online, Gia sư Trí Thức | 4/2023 - 7/2024: Nhận lớp gia sư online thông qua trung tâm Gia sư Trí Thức và dạy gia sư môn Tiếng Anh. Liên hệ, trao đổi với phụ huynh và học sinh để xác nhận thông tin lớp học, nhận lớp, dạy thử.',
        'Phó ban Nhân sự CLB Thương mại, CLB Thương mại Đại học',
      ],
    },
  ];

  const handleClickDownloadProfile = useCallback(() => {
    return role?.id === 3
      ? console.log('click')
      : message.warning(
          'Bạn cần phải là nhà tuyển dụng mới được tải hồ sơ ứng viên'
        );
  }, []);

  const columns: ColumnsType<JobListing> = [
    {
      key: 'name',
      width: '25%',
      dataIndex: 'name',
      title: 'Thông tin ứng viên',
      // className: 'before:!content-none lg:[&:not(:last-child)]:border-e',
      className: 'before:!content-none lg:[&>td:not(:last-child)]:border-e',
      render: (text: string, record: JobListing) => (
        <div className="space-y-2">
          <div className="font-medium">{text}</div>
          <div className="text-gray-500 text-sm">
            Được chia sẻ vào {record.timePosted}
          </div>
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <EnvironmentOutlined />
            <span>{record.location}</span>
            <ClockCircleOutlined className="ml-2" />
            <span>{record.age} tuổi</span>
          </div>
          <Button
            title="Tải hồ sơ"
            className="w-full"
            fill
            onClick={handleClickDownloadProfile}
          />
        </div>
      ),
    },
    {
      width: '40%',
      key: 'experience',
      title: 'Nguyện vọng & kinh nghiệm',
      className: 'before:!content-none',
      render: (record: JobListing) => (
        <div className="space-y-4 ">
          <div>
            <div className="text-gray-500 mb-1">Lĩnh vực</div>
            <div>{record.field}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Vị trí ứng tuyển</div>
            <Tag color="purple">{record.position}</Tag>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Số năm kinh nghiệm</div>
            <div>{record.experience}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Mức lương kỳ vọng</div>
            <p className="text-blue-500">{record.salary}</p>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Thời gian bắt đầu</div>
            <div>{record.startDate}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'requirements',
      title: 'Thành tích/kỹ năng nổi bật',
      render: (record: JobListing) => {
        const isExpanded = expandedRow.includes(record.key);

        return (
          <div>
            {isExpanded
              ? record.requirements.map((req, index) => (
                  <div key={index} className="mb-2">
                    • {req}
                  </div>
                ))
              : record.requirements.slice(0, 2).map((req, index) => (
                  <div key={index} className="mb-2">
                    • {req}
                  </div>
                ))}

            <a
              className="text-accent cursor-pointer"
              onClick={() => toggleExpand(record.key)}
            >
              {isExpanded ? 'Thu gọn' : 'Xem thêm'}
            </a>
          </div>
        );
      },
    },
  ];

  const handleInitForm = () => {
    form.setFieldsValue({ experience: 'all', field: 'all' });
  };

  const handleSearch = (values: any) => {
    console.log(values);
  };

  useEffect(() => {
    handleInitForm();
  }, []);

  return (
    <div className="min-h-[100vh]">
      <TopSearchBar
        form={form}
        placeHolder="Tìm kiếm theo vị trí ứng tuyển"
        onSearch={handleSearch}
        setIsDrawerSearchOpen={setIsOpenDrawer}
      >
        <FormItem name="experience" className="w-full h-10 max-w-48 mb-0">
          <CustomSelect
            showSearch={false}
            displayedType="text"
            className="w-full h-full"
            options={optionsExperience}
            prefixIcon={<BackPack />}
          />
        </FormItem>
        <FormItem name="field" className="w-full h-10 max-w-44 mb-0">
          <CustomSelect
            showSearch={false}
            displayedType="text"
            className="w-full h-full"
            options={jobFieldOptions}
            prefixIcon={<Box />}
          />
        </FormItem>
      </TopSearchBar>

      <DrawerSearch
        form={form}
        open={isOpenDrawer}
        title="Lọc ứng viên"
        onFilter={handleSearch}
        onCancel={handleInitForm}
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
          <h2 className="text-base font-medium">
            Có <span className="text-accent">2</span> ứng viên đang tìm việc
          </h2>
          <div className="text-sm text-sub">
            Tất cả ứng viên được chia sẻ miễn phí
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          className="bg-white shadow-sm rounded-lg"
        />
      </Space>
    </div>
  );
};

export default JobSeeker;
