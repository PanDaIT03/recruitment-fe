import { SearchOutlined } from '@ant-design/icons';
import { Input, Select } from 'antd';
import React from 'react';
import Button from '../Button/Button';

const { Option } = Select;

interface SearchBarProps {
  onSearch: (keyword: string, location: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = React.useState('');
  const [location, setLocation] = React.useState('');

  const handleSearch = () => {
    onSearch(keyword, location);
  };

  return (
    <div className="flex items-center space-x-2 my-4">
      <Input
        size="large"
        placeholder="Vị trí công việc/tên công ty"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="flex-1"
      />

      <Select
        size="large"
        placeholder="Toàn quốc"
        value={location}
        onChange={setLocation}
        className="w-1/4"
      >
        <Option value="">Toàn quốc</Option>
        <Option value="HCM">Hồ Chí Minh</Option>
        <Option value="HN">Hà Nội</Option>
      </Select>

      <Button
        fill
        type="button"
        title="Tìm kiếm"
        className="ml-2"
        displayType="primary"
        iconBefore={<SearchOutlined />}
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
