import { Col, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import { memo, useCallback, useEffect } from 'react';

import Content from '~/components/Content/Content';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import Select from '~/components/Select/Select';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getAllFunctionals } from '~/store/thunk/functional';

interface IProps {
  isOpen: boolean;
  onCancel: () => void;
  onFinish: (values: IFilterFunctionalGroupForm) => void;
}

export interface IFilterFunctionalGroupForm {
  title: string;
  functionalIds: number[];
}

const FilterFunctionalGroup = ({ isOpen, onCancel, onFinish }: IProps) => {
  const dispatch = useAppDispatch();
  const [form] = useForm<IFilterFunctionalGroupForm>();

  const { functionals, loading } = useAppSelector((state) => state.functional);

  useEffect(() => {
    if (!functionals?.items?.length) dispatch(getAllFunctionals({}));
  }, []);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onCancel();
  }, []);

  return (
    <Content isOpen={isOpen}>
      <FormWrapper
        form={form}
        cancelTitle="Hủy"
        submitTitle="Tìm kiếm"
        onFinish={onFinish}
        onCancel={handleCancel}
      >
        <Row gutter={[8, 16]} align="top">
          <Col span={12}>
            <FormItem name="title" label="Tên nhóm chức năng">
              <Input placeholder="Ví dụ: Chỉnh sửa công việc..." />
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
      </FormWrapper>
    </Content>
  );
};

export default memo(FilterFunctionalGroup);
