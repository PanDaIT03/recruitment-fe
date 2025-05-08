import { Badge, Form } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import React, {
  Dispatch,
  memo,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { JobsAPI } from '~/apis/job';
import { Filter, Search } from '~/assets/svg';
import { useFetch } from '~/hooks/useFetch';
import { JobPlacement } from '~/types/Job';
import icons from '~/utils/icons';
import Button from '../Button/Button';
import FilterBox from '../FilterBox/FilterBox';
import FormItem from '../Form/FormItem';
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
  onClear: () => void;
  onSearch: (values: any) => void;
  onPageChange: (page: number, pageSize?: number) => void;
  onSetFormValues: (form: FormInstance<any>, filterParams: any) => void;
  setIsDrawerSearchOpen?: Dispatch<SetStateAction<boolean>>;
}

const { EnvironmentOutlined, CloseCircleOutlined } = icons;

const TopSearchBar: React.FC<IProps> = ({
  form,
  children,
  placeHolder,
  onClear,
  onSearch,
  onPageChange,
  onSetFormValues,
  setIsDrawerSearchOpen,
}) => {
  const formValues = Form.useWatch([], form);

  const jobPlacements = useFetch<JobPlacement>(
    ['placements'],
    JobsAPI.getAllPlacements
  );

  const filledFormFields = useMemo(() => {
    const fieldsValue = form.getFieldsValue();
    const fieldsName = Object.entries(fieldsValue)
      .map((fieldValue) => {
        const [key, value] = fieldValue;

        if (value && value !== 'all') return key;
        else return '';
      })
      .filter((item) => item);

    return fieldsName;
  }, [formValues]);

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

  useEffect(() => {
    form.setFieldValue('placementIds', 'all');
  }, []);

  const handleFinish = useCallback((values: any) => {
    onSearch(values);
  }, []);

  return (
    <div className="w-full sticky left-0 top-16 z-30 shadow-lg">
      <FilterBox
        form={form}
        footer={<></>}
        wrapper={false}
        onCancel={onClear}
        onFinish={handleFinish}
        onPageChange={onPageChange}
        onSetFormValues={onSetFormValues}
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
              name="placementIds"
              className="hidden w-full max-w-[210px] mb-3 lg:block"
            >
              <CustomSelect
                allowClear
                className="h-10"
                placeholder="Chọn khu vực"
                options={placementOptions}
                prefixIcon={<EnvironmentOutlined />}
              />
            </FormItem>
            <Button fill type="submit" title="Tìm kiếm" />
            <Badge
              count={filledFormFields?.length}
              className="hidden max-lg:block"
            >
              <Button
                title={<Filter />}
                displayType="outline"
                onClick={() =>
                  setIsDrawerSearchOpen && setIsDrawerSearchOpen(true)
                }
              />
            </Badge>
          </div>
          <div className="hidden lg:flex lg:items-center lg:gap-2 lg:flex-wrap">
            {children}
            {!!filledFormFields?.length && (
              <Button
                title={<p className="text-[#F15224]">Bỏ lọc</p>}
                displayType="text"
                iconBefore={
                  <CloseCircleOutlined className="[&>svg]:fill-[#F15224]" />
                }
                onClick={onClear}
              />
            )}
          </div>
        </div>
      </FilterBox>
    </div>
  );
};

export default memo(TopSearchBar);
