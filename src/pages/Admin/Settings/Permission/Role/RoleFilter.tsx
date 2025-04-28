import { Col, FormInstance, Row } from 'antd';
import { memo, useCallback, useEffect } from 'react';
import { DatePicker } from '~/components/DatePicker/DatePicker';

import FilterBox from '~/components/FilterBox/FilterBox';
import FormItem from '~/components/Form/FormItem';
import Input from '~/components/Input/Input';
import Select from '~/components/Select/Select';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getAllFunctionals } from '~/store/thunk/functional';
import { IFilterForm } from './Role';

interface IRoleFilterBoxProps {
  open: boolean;
  form: FormInstance<IFilterForm>;
  onCancel: () => void;
  onFinish(values: IFilterForm): void;
  onPageChange: (page: number, pageSize?: number) => void;
}

const RoleFilter = ({
  form,
  open,
  onCancel,
  onFinish,
  onPageChange,
}: IRoleFilterBoxProps) => {
  const dispatch = useAppDispatch();
  const { functionals, loading } = useAppSelector((state) => state.functional);

  useEffect(() => {
    if (!open) return;
    dispatch(getAllFunctionals({ type: 'combobox' }));
  }, [open]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onCancel();
  }, []);

  const handleSetFormValues = useCallback(
    (_: FormInstance<any>, filterParams: IFilterForm) => {
      const fieldsValue = Object.entries(filterParams).reduce(
        (prevVal, currentVal) => {
          const [key, value] = currentVal;
          if (value) {
            if (key.includes('functionalIds'))
              prevVal[key] = Array.isArray(value)
                ? value?.map((item) => Number(item))
                : Number(value);
            else prevVal[key] = value;
          }

          return prevVal;
        },
        {} as Record<string, any>
      );

      form.setFieldsValue(fieldsValue);
    },
    []
  );

  return (
    <FilterBox
      open={open}
      form={form}
      onFinish={onFinish}
      onCancel={handleCancel}
      onPageChange={onPageChange}
      onSetFormValues={handleSetFormValues}
    >
      <Row gutter={[8, 16]}>
        <Col span={12}>
          <FormItem labelBold={false} label="Tên chức vụ" name="title">
            <Input allowClear placeholder="Ví dụ: admin" />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem labelBold={false} label="Ngày tạo" name="createdDate">
            <DatePicker allowClear format="DD/MM/YYYY" />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem labelBold={false} label="Chức năng" name="functionalIds">
            <Select
              allowClear
              mode="multiple"
              loading={loading}
              placeholder="Chọn chức năng"
              options={functionals?.items?.map((item) => ({
                label: item?.title,
                value: item?.id,
              }))}
            />
          </FormItem>
        </Col>
      </Row>
    </FilterBox>
  );
};

export default memo(RoleFilter);
