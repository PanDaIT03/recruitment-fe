import { Col, Row } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import { Dispatch, memo, SetStateAction, useCallback } from 'react';

import Button from '~/components/Button/Button';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import InputPassword from '~/components/Input/InputPassword';
import { PERMISSION } from '~/enums/permissions';
import { usePermission } from '~/hooks/usePermission';
import { IFormAccount } from '~/types/Account';
import { passwordRegex } from '~/utils/constant';
import icons from '~/utils/icons';

const { UserOutlined, MailOutlined, LockOutlined, EditOutlined } = icons;

interface IProps {
  loading?: boolean;
  form: FormInstance<IFormAccount>;
  hasPassword: boolean;
  isChangeName: boolean;
  isChangePassword: boolean;
  onCancel: () => void;
  onFinish: (values: IFormAccount) => void;
  setIsChangeName: Dispatch<SetStateAction<boolean>>;
  setIsChangePassword: Dispatch<SetStateAction<boolean>>;
}

const FormAccount = ({
  form,
  loading,
  hasPassword,
  isChangeName,
  isChangePassword,
  onCancel,
  onFinish,
  setIsChangeName,
  setIsChangePassword,
}: IProps) => {
  const { hasPermissions } = usePermission(PERMISSION.USER_UPDATE_ACCOUNT);

  const handleFinish = useCallback(
    (values: IFormAccount) => {
      const { newPassword, reEnterNewPassword } = values;
      if (newPassword !== reEnterNewPassword) {
        form.setFields([
          { name: 'reEnterNewPassword', errors: ['Mật khẩu không khớp'] },
        ]);

        return;
      }

      onFinish(values);
    },
    [form, onFinish]
  );

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
            <Button title="Huỷ" onClick={onCancel} loading={loading} />
          </Col>
          <Col>
            <Button type="submit" fill title="Xác nhận" loading={loading} />
          </Col>
        </Row>
      }
      onFinish={handleFinish}
    >
      <FormItem
        name="fullName"
        label="Họ và tên"
        rules={[
          {
            required: isChangeName,
            message: 'Hãy nhập họ và tên',
          },
        ]}
      >
        <Input
          name="fullName"
          disabled={!isChangeName}
          prefix={<UserOutlined />}
          suffix={
            hasPermissions && (
              <EditOutlined
                className="text-blue"
                onClick={() => setIsChangeName(true)}
              />
            )
          }
        />
      </FormItem>
      <FormItem name="email" label="Email">
        <Input disabled prefix={<MailOutlined />} name="email" />
      </FormItem>
      <FormItem hidden={isChangePassword}>
        {hasPermissions && (
          <Button
            displayType="text"
            title="Đổi mật khẩu"
            iconBefore={<EditOutlined />}
            className="text-blue hover:underline"
            onClick={() => setIsChangePassword(true)}
          />
        )}
      </FormItem>
      {hasPassword && (
        <FormItem
          className="mb-3"
          name="currentPassword"
          label="Mật khẩu cũ"
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
            prefix={<LockOutlined />}
            placeholder="Tối thiểu 8 ký tự"
          />
        </FormItem>
      )}
      <FormItem
        name="newPassword"
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
          prefix={<LockOutlined />}
          placeholder="Tối thiểu 8 ký tự"
        />
      </FormItem>
      <FormItem
        name="reEnterNewPassword"
        hidden={!isChangePassword}
        label="Nhập lại mật khẩu mới"
        rules={[
          {
            required: isChangePassword,
            message: 'Hãy nhập mật khẩu mới',
          },
        ]}
      >
        <InputPassword
          prefix={<LockOutlined />}
          placeholder="Tối thiểu 8 ký tự"
        />
      </FormItem>
    </FormWrapper>
  );
};

export default memo(FormAccount);
