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
  onPageChange: (page: number, pageSize?: number) => void;
}

const FilterMenu = ({
  isOpen,
  form,
  onCancel,
  onFinish,
  onPageChange,
}: IProps) => {
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
      onPageChange={onPageChange}
      onSetFormValues={hanldeSetFormValues}
    >
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
            <DatePicker placement="bottomRight" format="DD/MM/YYYY" />
          </FormItem>
        </Col>
      </Row>
    </FilterBox>
  );
};

export default memo(FilterMenu);
