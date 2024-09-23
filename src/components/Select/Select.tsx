import { Select as SelectAntd, SelectProps } from 'antd';

const Select = (props: SelectProps) => {
  const handleFilterOption = (input: any, option: any) => {
    if (typeof option?.label === 'number')
      return option.label.toString().includes(input);

    return (option?.label ?? '')
      .toString()
      .toLowerCase()
      .includes(input.toLowerCase());
  };

  const handleFilterSort = (optionA: any, optionB: any) => {
    if (
      typeof optionA?.label === 'number' ||
      typeof optionB?.label === 'number'
    )
      return null;

    return (optionA?.label ?? '')
      .toLowerCase()
      .localeCompare((optionB?.label ?? '').toLowerCase());
  };

  return (
    <SelectAntd
      showSearch
      size="large"
      optionFilterProp="children"
      filterSort={handleFilterSort}
      filterOption={handleFilterOption}
      {...props}
    />
  );
};

export default Select;
