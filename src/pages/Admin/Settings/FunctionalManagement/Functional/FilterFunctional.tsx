import { Col, Row } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { memo, useCallback } from 'react';

import FilterBox from '~/components/FilterBox/FilterBox';
import FormItem from '~/components/Form/FormItem';
import Input from '~/components/Input/Input';
import { IFilterFunctionalForm } from './Functional';

interface IProps {
  isOpen: boolean;
  form: FormInstance<IFilterFunctionalForm>;
  onCancel: () => void;
  onFinish: (values: IFilterFunctionalForm) => void;
}

const FilterFunctional = ({ isOpen, form, onCancel, onFinish }: IProps) => {
  const handleCancel = useCallback(() => {
    form.resetFields();
    onCancel();
  }, []);

  return (
    <FilterBox
      form={form}
      open={isOpen}
      onFinish={onFinish}
      onCancel={handleCancel}
    >
      <Row gutter={[8, 16]} align="middle">
        <Col span={12}>
          <FormItem labelBold={false} name="title" label="Tên chức năng">
            <Input allowClear placeholder="Ví dụ: Chỉnh sửa công việc..." />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem labelBold={false} name="code" label="Mã">
            <Input allowClear placeholder="Ví dụ: VIEW_EXAMPLE" />
          </FormItem>
        </Col>
      </Row>
    </FilterBox>
  );
};

export default memo(FilterFunctional);
