import { Col, Row } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { memo } from 'react';

import { DatePicker } from '~/components/DatePicker/DatePicker';
import FilterBox from '~/components/FilterBox/FilterBox';
import FormItem from '~/components/Form/FormItem';
import Input from '~/components/Input/Input';
import { colSpan } from '~/utils/constant';
import { IFilterFunctionalForm } from './Functional';

interface IProps {
  isOpen: boolean;
  form: FormInstance<IFilterFunctionalForm>;
  onCancel: () => void;
  onFinish: (values: IFilterFunctionalForm) => void;
  onPageChange: (page: number, pageSize?: number) => void;
}

const FilterFunctional = ({ isOpen, ...props }: IProps) => {
  return (
    <FilterBox open={isOpen} {...props}>
      <Row gutter={[8, 16]} align="middle">
        <Col span={colSpan}>
          <FormItem labelBold={false} name="title" label="Tên chức năng">
            <Input allowClear placeholder="Ví dụ: Chỉnh sửa công việc..." />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem labelBold={false} name="code" label="Mã">
            <Input allowClear placeholder="Ví dụ: VIEW_EXAMPLE" />
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

export default memo(FilterFunctional);
