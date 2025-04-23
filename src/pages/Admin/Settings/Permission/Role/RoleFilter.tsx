import { Col, FormInstance, Row } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { memo, useCallback, useEffect } from 'react';

import FilterBox from '~/components/FilterBox/FilterBox';
import Input from '~/components/Input/Input';
import Select from '~/components/Select/Select';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getAllFunctionals } from '~/store/thunk/functional';

interface IRoleFilterBoxProps {
  open: boolean;
  form: FormInstance<any>;
  onFinish(values: any): void;
  onCancel: () => void;
}

const RoleFilter = ({
  form,
  open,
  onCancel,
  onFinish,
}: IRoleFilterBoxProps) => {
  const dispatch = useAppDispatch();
  const { functionals, loading } = useAppSelector((state) => state.functional);

  useEffect(() => {
    if (!open) return;
    dispatch(getAllFunctionals({}));
  }, [open]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onCancel();
  }, []);

  return (
    <FilterBox
      open={open}
      form={form}
      onFinish={onFinish}
      onCancel={handleCancel}
    >
      <Row gutter={{ xs: 8, sm: 14 }}>
        <Col span={12}>
          <FormItem label="Tên chức vụ" name="title">
            <Input allowClear placeholder="Ví dụ: admin" />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="Chức năng" name="functionalIds">
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
