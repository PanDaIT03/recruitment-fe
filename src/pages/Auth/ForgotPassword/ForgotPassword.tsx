import { Col, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';

import FormWrapper from '~/components/FormWrapper/FormWrapper';
import InputForm from '~/components/Input/Input';
import { emailRegex } from '~/utils/constant';

const ForgotPassword = () => {
  const [form] = useForm();

  const handleFinish = (values: any) => {
    console.log(values);
  };

  return (
    <Col>
      <FormWrapper
        form={form}
        submitTitle="Gửi đường dẫn"
        onFinish={handleFinish}
      >
        <Form.Item
          name="email"
          label="Địa chỉ email"
          rules={[
            { required: true, message: 'Hãy nhập email' },
            { pattern: emailRegex, message: 'Email không hợp lệ' },
          ]}
        >
          <InputForm name="email" placeholder="abc@example.com" />
        </Form.Item>
      </FormWrapper>
    </Col>
  );
};

export default ForgotPassword;
