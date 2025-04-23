import { Col, Row } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import { memo, useCallback, useEffect } from 'react';

import FilterBox from '~/components/FilterBox/FilterBox';
import Input from '~/components/Input/Input';
import Select from '~/components/Select/Select';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getAllFunctionals } from '~/store/thunk/functional';
import { IFilterFunctionalGroupForm } from './FunctionalGroup';

interface IProps {
  isOpen: boolean;
  form: FormInstance<IFilterFunctionalGroupForm>;
  onCancel: () => void;
  onFinish: (values: IFilterFunctionalGroupForm) => void;
}

const FilterFunctionalGroup = ({
  form,
  isOpen,
  onCancel,
  onFinish,
}: IProps) => {
  const dispatch = useAppDispatch();
  const { functionals, loading } = useAppSelector((state) => state.functional);

  useEffect(() => {
    if (!functionals?.items?.length) dispatch(getAllFunctionals({}));
  }, []);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onCancel();
  }, []);

  const handleSetFormValues = (_: FormInstance<any>, filterParams: any) => {
    const fieldVallues = Object.entries(filterParams).reduce(
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

    form.setFieldsValue(fieldVallues);
  };

  return (
    <FilterBox
      form={form}
      open={isOpen}
      onFinish={onFinish}
      onCancel={handleCancel}
      onSetFormValues={handleSetFormValues}
    >
      <Row gutter={[8, 16]} align="top">
        <Col span={12}>
          <FormItem name="title" label="Tên nhóm chức năng">
            <Input allowClear placeholder="Ví dụ: Chỉnh sửa công việc..." />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem name="functionalIds" label="Chức năng">
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

export default memo(FilterFunctionalGroup);
