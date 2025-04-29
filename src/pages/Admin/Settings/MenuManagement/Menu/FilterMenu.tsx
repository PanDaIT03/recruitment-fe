import { Col, FormInstance, Row } from 'antd';
import { memo } from 'react';

import { DatePicker } from '~/components/DatePicker/DatePicker';
import FilterBox from '~/components/FilterBox/FilterBox';
import FormItem from '~/components/Form/FormItem';
import Input from '~/components/Input/Input';
import Select from '~/components/Select/Select';
import { colSpan } from '~/utils/constant';
import { iconTypeOptions, IFilterMenuView } from './Menu';

interface IProps {
  isOpen: boolean;
  form: FormInstance<IFilterMenuView>;
  onCancel: () => void;
  onFinish: (value: IFilterMenuView) => void;
  onPageChange: (page: number, pageSize?: number) => void;
}

const FilterMenu = ({ isOpen, ...props }: IProps) => {
  return (
    <FilterBox open={isOpen} {...props}>
      <Row gutter={[8, 16]} align={'middle'}>
        <Col span={12}>
          <FormItem labelBold={false} label="Tên menu" name="title">
            <Input allowClear placeholder="Ví dụ: Cá nhân" />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem labelBold={false} label="Path" name="path">
            <Input allowClear placeholder="Ví dụ: /user/profile" />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem labelBold={false} label="Order" name="orderIndex">
            <Input type="number" placeholder="Ví dụ: 1" />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem labelBold={false} label="Icon type" name="iconType">
            <Select options={iconTypeOptions} placeholder="Chọn loại icon" />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem labelBold={false} label="Ngày tạo" name="createdDate">
            <DatePicker allowClear format="DD/MM/YYYY" />
          </FormItem>
        </Col>
      </Row>
    </FilterBox>
  );
};

export default memo(FilterMenu);
