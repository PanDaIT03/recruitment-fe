import { useForm } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import React, { memo, ReactNode } from 'react';

import { JobsAPI } from '~/apis/job';
import { Location, Search } from '~/assets/svg';
import { useFetch } from '~/hooks/useFetch';
import { JobPlacement } from '~/types/Job';
import Button from '../Button/Button';
import FormItem from '../Form/FormItem';
import FormWrapper from '../Form/FormWrapper';
import Input from '../Input/Input';
import CustomSelect from '../Select/CustomSelect';

const optionLocations: DefaultOptionType[] = [
  {
    label: 'Toàn quốc',
    value: 'all',
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

  const { data: placements } = useFetch<JobPlacement>(JobsAPI.getAllPlacements);

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
            <FormItem name="title" className="flex-1 max-w-[957px] mb-3">
              <Input
                size="large"
                prefix={<Search />}
                placeholder={placeHolder}
                className="bg-light-gray"
              />
            </FormItem>
            <FormItem
              childrenSelected
              name="placmentsId"
              initialValue="all"
              className="w-full max-w-[198px] mb-3"
            >
              <CustomSelect
                allowClear
                className="h-10"
                placeholder="Chọn khu vực"
                prefixIcon={<Location />}
                configProvider={{
                  colorBgContainer: 'bg-light-gray',
                }}
                options={
                  placements?.items?.map((place) => ({
                    value: place?.id,
                    label: place?.title,
                  })) || optionLocations
                }
              />
            </FormItem>
            <Button fill type="submit" title="Tìm kiếm" />
          </div>
          <div className="flex gap-2">{children}</div>
        </div>
      </FormWrapper>
    </div>
  );
};

export default memo(TopSearchBar);
