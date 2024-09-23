import { Form } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import { PortFolio } from '~/assets/svg';
import CustomSelect from '~/components/Select/CustomSelect';
import Select from '~/components/Select/Select';
import TopSearchBar from '~/components/TopSearchBar/TopSearchBar';

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

const optionsField: DefaultOptionType[] = [{}];

const JobSeeker = () => {
  const handleSearch = (values: any) => {
    console.log(values);
  };

  return (
    <div className="min-h-[100vh]">
      <TopSearchBar
        placeHolder="Tìm kiếm theo vị trí ứng tuyển"
        onSearch={handleSearch}
      >
        <Form.Item name="experience" className="w-full h-10 max-w-48 mb-0">
          <CustomSelect
            className="w-full h-full"
            options={optionsExperience}
            prefixIcon={<PortFolio className="w-5 h-5" />}
          />
        </Form.Item>
        <Form.Item name="field" className="w-full h-10 max-w-48 mb-0">
          <Select options={optionsField} />
        </Form.Item>
      </TopSearchBar>
    </div>
  );
};

export default JobSeeker;
