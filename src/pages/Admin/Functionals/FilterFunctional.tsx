import { Col, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { memo, useCallback } from 'react';

import Content from '~/components/Content/Content';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';

interface IProps {
  isOpen: boolean;
  onCancel: () => void;
  onFinish: (values: IFilterFunctionalForm) => void;
}

export interface IFilterFunctionalForm {
  code: string;
  title: string;
}

const FilterFunctional = ({ isOpen, onCancel, onFinish }: IProps) => {
  const [form] = useForm<IFilterFunctionalForm>();

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
            <FormItem name="title" label="Tên chức năng">
              <Input placeholder="Ví dụ: Chỉnh sửa công việc..." />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem name="code" label="Mã">
              <Input placeholder="Ví dụ: edit_job" />
            </FormItem>
          </Col>
        </Row>
      </FormWrapper>
    </Content>
  );
};

export default memo(FilterFunctional);
