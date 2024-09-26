import { Col, FormInstance, Row } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { useState } from 'react';

import Button from '~/components/Button/Button';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import InputPassword from '~/components/Input/InputPassword';
import { IFormAccount } from '~/types/Account';
import { passwordRegex } from '~/utils/constant';
import icons from '~/utils/icons';

const { UserOutlined, MailOutlined, LockOutlined, EditOutlined } = icons;

interface IProps {
  form: FormInstance<IFormAccount>;
  onCancel: () => void;
  onFinish: (values: IFormAccount) => void;
}

const FormAccount = ({ form, onFinish, onCancel }: IProps) => {
  const [isChangeName, setIsChangeName] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);

  const handleCancel = () => {
    onCancel();

    setIsChangeName(false);
    setIsChangePassword(false);
  };

  return (
    <FormWrapper
      form={form}
      footer={
        <Row
          justify="end"
          gutter={[12, 12]}
          hidden={!(isChangePassword || isChangeName)}
        >
          <Col>
            <Button title="Huỷ" onClick={handleCancel} />
          </Col>
          <Col>
            <Button type="submit" fill title="Xác nhận" />
          </Col>
        </Row>
      }
      onFinish={onFinish}
    >
      <FormItem
        name="fullName"
        label="Họ và tên"
        rules={[
          {
            required: true,
            message: 'Hãy nhập họ và tên',
          },
        ]}
      >
        <Input
          name="fullName"
          disabled={!isChangeName}
          prefix={<UserOutlined />}
          suffix={
            <EditOutlined
              className="text-blue"
              onClick={() => setIsChangeName(true)}
            />
          }
        />
      </FormItem>
      <FormItem name="email" label="Email">
        <Input disabled prefix={<MailOutlined />} name="email" />
      </FormItem>
      <FormItem hidden={isChangePassword}>
        <Button
          displayType="text"
          title="Đổi mật khẩu"
          iconBefore={<EditOutlined />}
          className="text-blue hover:underline"
          onClick={() => setIsChangePassword(true)}
        />
      </FormItem>
      <FormItem
        name="password"
        className="mb-3"
        label="Mật khẩu mới"
        hidden={!isChangePassword}
        rules={[
          {
            pattern: passwordRegex,
            required: isChangePassword,
            message: 'Mật khẩu phải có ít nhất 8 ký tự',
          },
        ]}
      >
        <InputPassword
          name="password"
          type="password"
          prefix={<LockOutlined />}
          placeholder="Tối thiểu 8 ký tự"
        />
      </FormItem>
      <FormItem
        name="reEnterPassword"
        hidden={!isChangePassword}
        label="Nhập lại mật khẩu mới"
        rules={[
          {
            required: true,
            validator: (_, value) => {
              if (value !== form.getFieldValue('password'))
                return Promise.reject('Mật khẩu không khớp');

              return Promise.resolve();
            },
          },
        ]}
      >
        <InputPassword
          type="password"
          name="reEnterPassword"
          prefix={<LockOutlined />}
          placeholder="Tối thiểu 8 ký tự"
        />
      </FormItem>
    </FormWrapper>
  );
};

export default FormAccount;
