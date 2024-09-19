import { Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import React, { memo, useState } from 'react';

import { LOCATION } from '~/assets/img';
import icons from '~/utils/icons';
import Button from '../Button/Button';
import FormWrapper from '../FormWrapper/FormWrapper';
import Icon from '../Icon/Icon';
import Select from '../Select/Select';

const { SearchOutlined } = icons;

const optionLocations: DefaultOptionType[] = [
  {
    label: 'Toàn quốc',
    value: 'Toàn quốc',
  },
  {
    label: 'Hồ Chí Minh',
    value: 'Hồ Chí Minh',
  },
  {
    label: 'Hà Nội',
    value: 'Hà Nội',
  },
];

interface IProps {
  placeHolder?: string;
  onSearch: (keyword: string, location: string) => void;
}

const SearchBar: React.FC<IProps> = ({ placeHolder, onSearch }) => {
  const [form] = useForm();

  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    onSearch(keyword, location);
  };

  const handleFinish = (values: any) => {
    console.log(values);
  };

  return (
    <FormWrapper
      form={form}
      onFinish={handleFinish}
      className="w-full bg-white py-3 px-8"
    >
      <div className="flex w-full mx-auto gap-x-4 max-w-7xl">
        <Form.Item name="keyword" className="flex-1 max-w-[957px]">
          <Input
            size="large"
            value={keyword}
            placeholder={placeHolder}
            prefix={<SearchOutlined />}
            className="bg-light-gray"
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Form.Item>
        <Form.Item name="location" className="w-full max-w-[198px]">
          <Select
            placeholder="Toàn quốc"
            colorBgContainer="#FAFAFA"
            options={optionLocations}
            prefixIcon={<Icon icon={LOCATION} width={16} height={16} />}
          />
        </Form.Item>
        <Button
          fill
          type="button"
          title="Tìm kiếm"
          displayType="primary"
          onClick={handleSearch}
        />
      </div>
    </FormWrapper>
  );
};

export default memo(SearchBar);
