import { ConfigProvider, Select as SelectAntd, SelectProps } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

const Select = ({ className, ...props }: SelectProps) => {
  const customClass = classNames(
    'min-h-10 [&>.ant-select-selector]:min-h-10',
    className
  );

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

    if (typeof optionA?.label === 'string')
      return (optionA?.label ?? '')
        .toLowerCase()
        .localeCompare((optionB?.label ?? '').toLowerCase());

    return optionA;
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            colorBgContainer: '#fafafa',
          },
        },
      }}
    >
      <SelectAntd
        showSearch
        size="middle"
        className={customClass}
        optionFilterProp="children"
        filterSort={handleFilterSort}
        filterOption={handleFilterOption}
        {...props}
      />
    </ConfigProvider>
  );
};

export default memo(Select);
