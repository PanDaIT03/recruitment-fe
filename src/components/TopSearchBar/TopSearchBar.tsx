import { Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import React, { memo, ReactNode, useEffect } from 'react';

import { LOCATION } from '~/assets/img';
import icons from '~/utils/icons';
import Button from '../Button/Button';
import FormWrapper from '../FormWrapper/FormWrapper';
import Icon from '../Icon/Icon';
import CustomSelect from '../Select/CustomSelect';

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
  children?: ReactNode;
  placeHolder?: string;
  onSearch: (values: any) => void;
}

const TopSearchBar: React.FC<IProps> = ({
  children,
  placeHolder,
  onSearch,
}) => {
  const [form] = useForm();

  useEffect(() => {
    form.setFieldValue('location', 'Toàn quốc');
  }, []);

  const handleFinish = (values: any) => {
    onSearch(values);
  };

  return (
    <div className="w-full sticky left-0 top-16 z-30 shadow-lg">
      <FormWrapper
        form={form}
        onFinish={handleFinish}
        className="w-full bg-white py-3 px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex w-full gap-x-4">
            <Form.Item name="keyword" className="flex-1 max-w-[957px]">
              <Input
                size="large"
                placeholder={placeHolder}
                prefix={<SearchOutlined />}
                className="bg-light-gray"
              />
            </Form.Item>
            <Form.Item name="location" className="w-full max-w-[198px]">
              <CustomSelect
                colorBgContainer="#FAFAFA"
                placeholder="Chọn khu vực"
                options={optionLocations}
                prefixIcon={<Icon icon={LOCATION} width={16} height={16} />}
              />
            </Form.Item>
            <Button fill type="submit" title="Tìm kiếm" />
          </div>
          <div className="flex gap-2">{children}</div>
        </div>
      </FormWrapper>
    </div>
  );
};

export default memo(TopSearchBar);
