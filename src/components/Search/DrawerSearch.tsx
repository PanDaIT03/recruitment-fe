import { Drawer, DrawerProps, Flex } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import { Dispatch, SetStateAction, useMemo } from 'react';

import { JobsAPI } from '~/apis/job';
import { useFetch } from '~/hooks/useFetch';
import { JobPlacement } from '~/types/Job';
import icons from '~/utils/icons';
import Button from '../Button/Button';
import FormItem from '../Form/FormItem';
import FormWrapper from '../Form/FormWrapper';
import Select from '../Select/Select';
import { defaultLocation } from './TopSearchBar';

const { CloseOutlined, FilterOutlined } = icons;

interface IProps extends DrawerProps {
  form: FormInstance;
  onCancel: () => void;
  onFilter: (values: any) => void;
  setIsOpenDrawer: Dispatch<SetStateAction<boolean>>;
}

const DrawerSearch: React.FC<IProps> = ({
  form,
  footer,
  children,
  onFilter,
  onCancel,
  onClose,
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

  const handleFinish = (values: any) => {
    onFilter(values);
    setIsOpenDrawer(false);
  };

  const handleCancel = () => {
    setIsOpenDrawer(false);
    onCancel && onCancel();
  };

  return (
    <Drawer
      {...props}
      onClose={handleClose}
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
            iconBefore={<FilterOutlined />}
            onClick={() => form.submit()}
          />
        </Flex>
      }
    >
      <FormWrapper form={form} onFinish={handleFinish}>
        <FormItem label="Địa điểm" name="placement">
          <Select
            allowClear
            className="w-full h-10"
            placeholder="Chọn khu vực"
            options={placementOptions}
          />
        </FormItem>
        {children}
      </FormWrapper>
    </Drawer>
  );
};

export default DrawerSearch;
