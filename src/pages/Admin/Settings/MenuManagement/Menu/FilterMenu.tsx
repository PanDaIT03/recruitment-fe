import { Col, FormInstance, Row } from 'antd';
import dayjs from 'dayjs';
import { memo, useCallback } from 'react';

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
}

const FilterMenu = ({ isOpen, form, onCancel, onFinish }: IProps) => {
  const handleCancel = useCallback(() => {
    form.resetFields();
    onCancel();
  }, []);

  const hanldeSetFormValues = (
    _: FormInstance<any>,
    filterParams: IFilterMenuView
  ) => {
    const { createdDate, ...rest } = filterParams;
    const fieldValues: IFilterMenuView = {
      ...rest,
      createdDate: createdDate ? dayjs(createdDate) : '',
    };

    form.setFieldsValue(fieldValues);
  };

  return (
    <FilterBox
      open={isOpen}
      form={form}
      onFinish={onFinish}
      onCancel={handleCancel}
      onSetFormValues={hanldeSetFormValues}
    >
      <Row gutter={[8, 16]} align={'middle'}>
        <Col span={12}>
          <FormItem label="Tên menu" name="title">
            <Input allowClear />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="Path" name="path">
            <Input allowClear />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem label="Order" name="orderIndex">
            <Input type="number" />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem label="Icon type" name="iconType">
            <Select options={iconTypeOptions} />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem label="Ngày tạo" name="createdDate">
            <DatePicker placement="bottomRight" format="DD/MM/YYYY" />
          </FormItem>
        </Col>
      </Row>
    </FilterBox>
  );
};

export default memo(FilterMenu);
