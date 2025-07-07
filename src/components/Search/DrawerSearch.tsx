import { Drawer, DrawerProps, Flex } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import { Dispatch, memo, SetStateAction, useMemo } from 'react';

import { JobsAPI } from '~/apis/job';
import { Filter } from '~/assets/svg';
import { useFetch } from '~/hooks/useFetch';
import { JobPlacement } from '~/types/Job';
import icons from '~/utils/icons';
import Button from '../Button/Button';
import FilterBox from '../FilterBox/FilterBox';
import FormItem from '../Form/FormItem';
import Select from '../Select/Select';
import { defaultLocation } from './TopSearchBar';

const { CloseOutlined } = icons;

interface IProps extends DrawerProps {
  form: FormInstance;
  onCancel: () => void;
  onFilter: (values: any) => void;
  onPageChange: (page: number, pageSize?: number) => void;
  // onSetFormValues: (form: FormInstance<any>, filterParams: any) => void;
  setIsOpenDrawer: Dispatch<SetStateAction<boolean>>;
}

const DrawerSearch: React.FC<IProps> = ({
  form,
  footer,
  children,
  onFilter,
  onCancel,
  onClose,
  onPageChange,
  // onSetFormValues,
  setIsOpenDrawer,
  ...props
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

  const handleClose = (e: React.MouseEvent | React.KeyboardEvent) => {
    setIsOpenDrawer(false);
    onClose && onClose(e);
  };

  const handleCancel = () => {
    setIsOpenDrawer(false);
    onCancel && onCancel();
  };

  return (
    <Drawer
      classNames={{ wrapper: '!w-[55%] max-md:!w-[80%]' }}
      footer={
        <Flex gap={24} align="center" className="py-4 px-6">
          <Button
            title="Huỷ"
            className="w-full"
            displayType="outline"
            iconBefore={<CloseOutlined />}
            onClick={handleCancel}
          />
          <Button
            fill
            title="Áp dụng"
            className="w-full"
            iconBefore={<Filter />}
            onClick={() => form.submit()}
          />
        </Flex>
      }
      onClose={handleClose}
      {...props}
    >
      <FilterBox
        form={form}
        footer={<></>}
        wrapper={false}
        onFinish={onFilter}
        onCancel={handleCancel}
        onPageChange={onPageChange}
        // onSetFormValues={onSetFormValues}
      >
        <FormItem childrenSelected label="Địa điểm" name="placementIds">
          <Select
            allowClear
            className="w-full h-10"
            placeholder="Chọn khu vực"
            options={placementOptions}
          />
        </FormItem>
        {children}
      </FilterBox>
    </Drawer>
  );
};

export default memo(DrawerSearch);
