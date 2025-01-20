import { Col, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import { memo, useCallback } from 'react';

import Content from '~/components/Content/Content';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import Select from '~/components/Select/Select';
import { useAppSelector } from '~/hooks/useStore';

interface IProps {
  isOpen: boolean;
  onCancel: () => void;
  onFinish: (values: IFilterFunctionalGroupForm) => void;
}

export interface IFilterFunctionalGroupForm {
  title: string;
  functionalGroupIds: number[];
}

const FilterFunctionalGroup = ({ isOpen, onCancel, onFinish }: IProps) => {
  const [form] = useForm<IFilterFunctionalGroupForm>();

  const { functionalGroups, loading } = useAppSelector(
    (state) => state.functionalGroup
  );

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
        <Row gutter={[8, 16]} align="middle">
          <Col span={12}>
            <FormItem name="title" label="Tên nhóm chức năng">
              <Input placeholder="Ví dụ: Chỉnh sửa công việc..." />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem name="functionalGroupIds" label="Nhóm chức năng">
              <Select
                mode="multiple"
                loading={loading}
                placeholder="Chọn nhóm chức năng"
                options={functionalGroups?.items?.map((item) => ({
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
