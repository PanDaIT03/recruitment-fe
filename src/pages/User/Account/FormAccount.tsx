import { Col, Form, FormInstance, Row } from 'antd';
import { useState } from 'react';

import Button from '~/components/Button/Button';
import FormWrapper from '~/components/FormWrapper/FormWrapper';
import InputForm from '~/components/Input/Input';
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

  const handleChangePassword = () => {
    form.setFieldValue('password', undefined);
    setIsChangePassword(true);
  };

  const handleCancel = () => {
    onCancel();

    setIsChangeName(false);
    setIsChangePassword(false);
  };

  return (
    <FormWrapper form={form} onFinish={onFinish}>
      <Form.Item
        name="fullName"
        label="Họ và tên"
        rules={[
          {
            required: true,
            message: 'Hãy nhập họ và tên',
          },
        ]}
      >
        <InputForm
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
      </Form.Item>
      <Form.Item name="email" label="Email">
        <InputForm disabled prefix={<MailOutlined />} name="email" />
      </Form.Item>
      <Form.Item
        name="password"
        className="mb-3"
        label={isChangePassword ? 'Mật khẩu mới' : 'Mật khẩu'}
        rules={
          isChangePassword
            ? [
                {
                  pattern: passwordRegex,
                  required: isChangePassword,
                  message: 'Mật khẩu phải có ít nhất 8 ký tự',
                },
              ]
            : []
        }
      >
        {isChangePassword ? (
          <InputPassword
            name="password"
            type="password"
            prefix={<LockOutlined />}
            placeholder="Tối thiểu 8 ký tự"
          />
        ) : (
          <InputForm
            name="password"
            type="password"
            prefix={<LockOutlined />}
            disabled={!isChangePassword}
            suffix={
              <EditOutlined
                className="text-blue"
                onClick={handleChangePassword}
              />
            }
          />
        )}
      </Form.Item>
      <Form.Item
        name="reEnterPassword"
        hidden={!isChangePassword}
        label="Nhập lại mật khẩu mới"
        rules={
          isChangePassword
            ? [
                {
                  required: true,
                  validator: (_, value) => {
                    if (value !== form.getFieldValue('password'))
                      return Promise.reject('Mật khẩu không khớp');

                    return Promise.resolve();
                  },
                },
              ]
            : []
        }
      >
        <InputPassword
          type="password"
          name="reEnterPassword"
          prefix={<LockOutlined />}
          placeholder="Tối thiểu 8 ký tự"
        />
      </Form.Item>
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
    </FormWrapper>
  );
};

export default FormAccount;
