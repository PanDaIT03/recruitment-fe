import { DefaultOptionType } from 'antd/es/select';

import { BlockChain, PortFolio } from '~/assets/svg';
import FormItem from '~/components/Form/FormItem';
import CustomSelect from '~/components/Select/CustomSelect';
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
            prefixIcon={<PortFolio className="w-5 h-5" />}
          />
        </FormItem>
        <FormItem
          childrenSelected
          name="field"
          className="w-full h-10 max-w-56 mb-0"
        >
          <CustomSelect
            showSearch={false}
            displayedType="text"
            className="w-full h-full"
            options={optionsField}
            prefixIcon={<BlockChain className="w-5 h-5" />}
          />
        </FormItem>
      </TopSearchBar>
    </div>
  );
};

export default JobSeeker;
