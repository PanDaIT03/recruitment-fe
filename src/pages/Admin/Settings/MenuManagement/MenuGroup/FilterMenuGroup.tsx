import { Col, FormInstance, Row } from 'antd';
import { memo, useCallback } from 'react';

import { DatePicker } from '~/components/DatePicker/DatePicker';
import FilterBox from '~/components/FilterBox/FilterBox';
import FormItem from '~/components/Form/FormItem';
import Input from '~/components/Input/Input';
import Select from '~/components/Select/Select';
import { useAppSelector } from '~/hooks/useStore';
import { colSpan } from '~/utils/constant';
import { IMenuGroupForm } from './MenuGroup';

interface IProps {
  isOpen: boolean;
  form: FormInstance<IMenuGroupForm>;
  onCancel: () => void;
  onFinish: (value: IMenuGroupForm) => void;
  onPageChange: (page: number, pageSize?: number) => void;
}

const FilterMenuGroup = ({
  isOpen,
  form,
  onCancel,
  onFinish,
  onPageChange,
}: IProps) => {
  const { menuViews, loading } = useAppSelector((state) => state.menuView);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onCancel();
  }, []);

  const handleSetFormValues = useCallback(
    (_: any, filterParams: IMenuGroupForm) => {
      const { menuViewIds } = filterParams;
      const fieldsValue = {
        ...filterParams,
        menuViewIds: menuViewIds?.map((menuViewId) => Number(menuViewId)),
      };

      form.setFieldsValue(fieldsValue);
    },
    []
  );

  return (
    <FilterBox
      open={isOpen}
      form={form}
      onFinish={onFinish}
      onCancel={handleCancel}
      onPageChange={onPageChange}
      onSetFormValues={handleSetFormValues}
    >
      <Row gutter={[8, 16]} align={'middle'}>
        <Col span={colSpan}>
          <FormItem labelBold={false} label="Tên menu" name="title">
            <Input allowClear placeholder="Ví dụ: Người tìm việc" />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem labelBold={false} label="Order" name="orderIndex">
            <Input type="number" placeholder="Ví dụ: 1" />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem labelBold={false} label="Ngày tạo" name="createdDate">
            <DatePicker allowClear format="DD/MM/YYYY" />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem labelBold={false} label="Menu" name="menuViewIds">
            <Select
              allowClear
              mode="multiple"
              loading={loading}
              placeholder="Chọn menu"
              options={menuViews?.items?.map((menuView) => ({
                label: menuView?.title,
                value: menuView?.id,
              }))}
            />
          </FormItem>
        </Col>
      </Row>
    </FilterBox>
  );
};

export default memo(FilterMenuGroup);
