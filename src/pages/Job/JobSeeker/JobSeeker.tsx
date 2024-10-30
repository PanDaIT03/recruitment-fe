import { DefaultOptionType } from 'antd/es/select';

import { BackPack, BlockChain, Box, PortFolio } from '~/assets/svg';
import FormItem from '~/components/Form/FormItem';
import CustomSelect from '~/components/Select/CustomSelect';
import TopSearchBar from '~/components/TopSearchBar/TopSearchBar';
import { message, Table, Tag } from 'antd';
import icons from '~/utils/icons';
import Button from '~/components/Button/Button.tsx';
import { ColumnsType } from 'antd/es/table';
import { useAppSelector } from '~/hooks/useStore.ts';
import { useCallback } from 'react';

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

const optionsField: DefaultOptionType[] = [
  {
    label: 'Tất cả lĩnh vực',
    value: 'all',
  },
  {
    label: 'Accountant/Finance/Investment',
    value: 'op1',
  },
  {
    label: 'Biên/Phiên dịch',
    value: 'op2',
  },
  {
    label: 'Bán lẻ/Tiêu dùng',
    value: 'op3',
  },
];

const JobSeeker = () => {
  const { role } = useAppSelector((state) => state.auth.currentUser);

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
      title: 'Thông tin ứng viên',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: JobListing) => (
        <div className="space-y-2 ">
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
      width: '25%',
    },
    {
      title: 'Nguyện vọng & kinh nghiệm',
      key: 'experience',
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
      width: '40%',
    },
    {
      title: 'Thành tích/kỹ năng nổi bật',
      key: 'requirements',
      render: (record: JobListing) => (
        <div>
          {record.requirements.slice(0, 2).map((req, index) => (
            <div key={index} className="mb-2">
              • {req}
            </div>
          ))}
          <a className="text-blue-500">Xem thêm </a>
        </div>
      ),
    },
  ];

  const handleSearch = (values: any) => {
    console.log(values);
  };

  return (
    <div className="min-h-[100vh]">
      <TopSearchBar
        placeHolder="Tìm kiếm theo vị trí ứng tuyển"
        onSearch={handleSearch}
      >
        <FormItem
          childrenSelected
          name="experience"
          className="w-full h-10 max-w-48 mb-0"
        >
          <CustomSelect
            showSearch={false}
            displayedType="text"
            className="w-full h-full"
            options={optionsExperience}
            prefixIcon={<BackPack />}
          />
        </FormItem>
        <FormItem
          childrenSelected
          name="field"
          className="w-full h-10 max-w-44 mb-0"
        >
          <CustomSelect
            showSearch={false}
            displayedType="text"
            className="w-full h-full"
            options={optionsField}
            prefixIcon={<Box />}
          />
        </FormItem>
      </TopSearchBar>

      <div className="container mx-auto p-4">
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
      </div>
    </div>
  );
};

export default JobSeeker;
