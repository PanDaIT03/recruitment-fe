import { Col, Form, FormInstance, Row } from 'antd';
import classNames from 'classnames';
import { memo, ReactNode } from 'react';
import Button from '../Button/Button';

interface IProps {
  isCancel?: boolean;
  children: ReactNode;
  className?: string;
  submitTitle: string;
  cancelTitle?: string;
  form: FormInstance<any>;
  onCancel?: () => void;
  onFinish(values: any): void;
}

const FormWrapper = ({
  form,
  children,
  submitTitle,
  cancelTitle = 'Hủy',
  className = 'w-full',
  isCancel = false,
  onCancel,
  onFinish,
}: IProps) => {
  const checkFormValidate = async () => {
    try {
      await form.validateFields();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleFinish = async (values: any) => {
    if (!(await checkFormValidate())) return;
    onFinish(values);
  };

  return (
    <div className={className}>
      <Form
        form={form}
        size="small"
        layout="vertical"
        autoComplete="off"
        onFinish={handleFinish}
      >
        {children}
        <Row gutter={[12, 12]} justify={'end'}>
          {isCancel && (
            <Col>
              <Button title={cancelTitle} onClick={onCancel} />
            </Col>
          )}
          <Col span={24}>
            <Button fill title={submitTitle} type="submit" className="w-full" />
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default memo(FormWrapper);
