import { Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import React, { memo, ReactNode, useEffect } from 'react';

import { LOCATION } from '~/assets/img';
import icons from '~/utils/icons';
import Button from '../Button/Button';
import FormWrapper from '../FormWrapper/FormWrapper';
import Icon from '../Icon/Icon';
import Select from '../Select/Select';
import { useFetch } from '~/hooks/useFetch';
import { JobPlacement } from '~/types/Job';
import { JobsAPI } from '~/apis/job';

const { SearchOutlined } = icons;

const optionLocations: DefaultOptionType[] = [
  {
    label: 'Toàn quốc',
    value: 'Toàn quốc',
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

  const { data: placements } = useFetch<JobPlacement[]>(
    JobsAPI.getAllPlacements
  );

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
        <div className="flex w-full mx-auto gap-x-4 max-w-7xl">
          <Form.Item name="keyword" className="flex-1 max-w-[957px]">
            <Input
              size="large"
              placeholder={placeHolder}
              prefix={<SearchOutlined />}
              className="bg-light-gray"
            />
          </Form.Item>
          <Form.Item name="location" className="w-full max-w-[198px]">
            <Select
              colorBgContainer="#FAFAFA"
              placeholder="Chọn khu vực"
              options={
                placements
                  ? placements.map((place) => ({
                      label: place.title,
                      value: place.id,
                    }))
                  : optionLocations
              }
              prefixIcon={<Icon icon={LOCATION} width={16} height={16} />}
            />
          </Form.Item>
          <Button fill type="submit" title="Tìm kiếm" />
        </div>
        <div>{children}</div>
      </FormWrapper>
    </div>
  );
};

export default memo(TopSearchBar);
