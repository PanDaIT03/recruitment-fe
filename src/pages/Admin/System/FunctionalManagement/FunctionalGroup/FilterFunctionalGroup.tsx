import { Col, Row } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { memo, useCallback } from 'react';

import { DatePicker } from '~/components/DatePicker/DatePicker';
import FilterBox from '~/components/FilterBox/FilterBox';
import FormItem from '~/components/Form/FormItem';
import Input from '~/components/Input/Input';
import Select from '~/components/Select/Select';
import { useAppSelector } from '~/hooks/useStore';
import { colSpan } from '~/utils/constant';
import { IFilterFunctionalGroupForm } from './FunctionalGroup';

interface IProps {
  isOpen: boolean;
  form: FormInstance<IFilterFunctionalGroupForm>;
  onCancel: () => void;
  onFinish: (values: IFilterFunctionalGroupForm) => void;
  onPageChange: (page: number, pageSize?: number) => void;
}

const FilterFunctionalGroup = ({ isOpen, form, ...props }: IProps) => {
  const { functionals, loading } = useAppSelector((state) => state.functional);

  const handleSetFormValues = useCallback((_: any, filterParams: any) => {
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
  }, []);

  return (
    <FilterBox
      form={form}
      open={isOpen}
      onSetFormValues={handleSetFormValues}
      {...props}
    >
      <Row gutter={[8, 16]} align="top">
        <Col span={colSpan}>
          <FormItem labelBold={false} name="title" label="Tên nhóm chức năng">
            <Input allowClear placeholder="Ví dụ: Chỉnh sửa công việc..." />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem labelBold={false} name="functionalIds" label="Chức năng">
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
        <Col span={colSpan}>
          <FormItem labelBold={false} name="createdDate" label="Ngày tạo">
            <DatePicker allowClear format="DD/MM/YYYY" />
          </FormItem>
        </Col>
      </Row>
    </FilterBox>
  );
};

export default memo(FilterFunctionalGroup);
