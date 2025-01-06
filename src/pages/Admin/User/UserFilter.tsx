import { Col, FormInstance, Row } from 'antd';
import { memo, useCallback } from 'react';

import Content from '~/components/Content/Content';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import Select from '~/components/Select/Select';

interface IProps {
  open: boolean;
  form: FormInstance<any>;
  onCancel: () => void;
  onFinish: (values: any) => void;
}

const UserFilter = ({ open, form, onCancel, onFinish }: IProps) => {
  const handleCancel = useCallback(() => {
    form.resetFields();
    onCancel();
  }, []);

  return (
    <Content isOpen={open}>
      <FormWrapper
        form={form}
        cancelTitle="Hủy"
        submitTitle="Tìm kiếm"
        onFinish={onFinish}
        onCancel={handleCancel}
      >
        <Row gutter={[8, 16]} align="middle">
          <Col span={8}>
            <FormItem name="email" label="Email">
              <Input placeholder="Ví dụ: abc@gmail.com" />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem name="role" label="Quyền">
              <Select placeholder="Chọn quyền" />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem name="status" label="Trạng thái">
              <Select placeholder="Chọn trạng thái" />
            </FormItem>
          </Col>
        </Row>
      </FormWrapper>
    </Content>
  );
};

export default memo(UserFilter);
