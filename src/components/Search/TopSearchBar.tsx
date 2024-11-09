import { FormInstance } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import React, {
  Dispatch,
  memo,
  ReactNode,
  SetStateAction,
  useMemo,
} from 'react';

import { JobsAPI } from '~/apis/job';
import { Filter, Location, Search } from '~/assets/svg';
import { useFetch } from '~/hooks/useFetch';
import { JobPlacement } from '~/types/Job';
import Button from '../Button/Button';
import FormItem from '../Form/FormItem';
import FormWrapper from '../Form/FormWrapper';
import Input from '../Input/Input';
import CustomSelect from '../Select/CustomSelect';

export const defaultLocation: DefaultOptionType[] = [
  {
    label: 'Toàn quốc',
    value: 'all',
  },
];

interface IProps {
  form: FormInstance;
  children?: ReactNode;
  placeHolder?: string;
  onSearch: (values: any) => void;
  setIsDrawerSearchOpen?: Dispatch<SetStateAction<boolean>>;
}

const TopSearchBar: React.FC<IProps> = ({
  form,
  children,
  placeHolder,
  onSearch,
  setIsDrawerSearchOpen,
}) => {
  const jobPlacements = useFetch<JobPlacement>(
    ['placements'],
    JobsAPI.getAllPlacements
  );

  const placementOptions = useMemo(() => {
    if (!jobPlacements?.data?.items.length) return defaultLocation;

    const placementItems: DefaultOptionType[] = jobPlacements?.data?.items.map(
      (placement) => ({
        label: placement.title,
        value: placement.id,
      })
    );

    return [...placementItems, ...defaultLocation];
  }, [jobPlacements]);

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
                allowClear
                size="large"
                prefix={<Search />}
                placeholder={placeHolder}
                className="bg-light-gray"
              />
            </FormItem>
            <FormItem
              childrenSelected
              name="placement"
              className="hidden w-full max-w-[198px] mb-3 lg:block"
            >
              <CustomSelect
                allowClear
                className="h-10"
                placeholder="Chọn khu vực"
                prefixIcon={<Location />}
                options={placementOptions}
              />
            </FormItem>
            <Button fill type="submit" title="Tìm kiếm" />
            <Button
              title={<Filter />}
              displayType="outline"
              className="hidden max-lg:block"
              onClick={() =>
                setIsDrawerSearchOpen && setIsDrawerSearchOpen(true)
              }
            />
          </div>
          <div className="hidden md:flex md:gap-2">{children}</div>
        </div>
      </FormWrapper>
    </div>
  );
};

export default memo(TopSearchBar);
