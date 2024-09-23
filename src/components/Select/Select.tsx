import { Select as SelectAntd, SelectProps } from 'antd';
import { memo } from 'react';

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

    if (optionA?.value === 'all') return -1;
    if (optionB?.value === 'all') return 1;

    return (optionA?.label ?? '')
      .toLowerCase()
      .localeCompare((optionB?.label ?? '').toLowerCase());
  };

  return (
    <SelectAntd
      showSearch
      size="middle"
      optionFilterProp="children"
      filterSort={handleFilterSort}
      filterOption={handleFilterOption}
      {...props}
    />
  );
};

export default memo(Select);
