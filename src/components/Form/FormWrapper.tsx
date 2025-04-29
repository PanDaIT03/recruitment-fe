import { Col, Form, FormInstance, FormProps, Row } from 'antd';
import { InternalNamePath } from 'antd/es/form/interface';
import classNames from 'classnames';
import { memo, ReactNode } from 'react';

import { useAppSelector } from '~/hooks/useStore';
import Button from '../Button/Button';

type IProps = {
  loading?: boolean;
  children: ReactNode;
  className?: string;
  submitTitle?: string;
  cancelTitle?: string;
  form: FormInstance<any>;
  footer?: ReactNode;
  cancelClass?: string;
  submitClass?: string;
  onCancel?: () => void;
  onFinish(values: any): void;
} & FormProps;

interface IErrorFields {
  name: InternalNamePath;
  errors: string[];
}

const FormWrapper = ({
  form,
  footer,
  children,
  cancelTitle,
  submitTitle,
  loading = false,
  className = 'w-full',
  cancelClass,
  submitClass,
  onCancel,
  onFinish,
  ...passProps
}: IProps) => {
  const { loading: isLoadingSignIn } = useAppSelector((state) => state.auth);

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

    const formattedValues = Object.entries(values).reduce(
      (prevVal, currentVal) => {
        const [key, value] = currentVal;

        prevVal[key] =
          value && typeof value === 'string' ? value?.trim() : value;

        return prevVal;
      },
      {} as Record<string, any>
    );

    onFinish(formattedValues);
  };

  const handleFinishFailed = (errorFields: IErrorFields[]) => {
    if (!errorFields.length) return;

    form.scrollToField(errorFields[0].name, {
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <div className={className}>
      <Form
        form={form}
        size="small"
        layout="vertical"
        autoComplete="on"
        onFinish={handleFinish}
        onFinishFailed={({ errorFields }) => handleFinishFailed(errorFields)}
        {...passProps}
      >
        {children}
        {footer || (
          <Row gutter={[12, 12]} justify={'end'}>
            {cancelTitle && (
              <Col>
                <Button
                  title={cancelTitle}
                  className={cancelClass}
                  onClick={onCancel}
                />
              </Col>
            )}
            {submitTitle && (
              <Col span={cancelTitle ? undefined : 24}>
                <Button
                  fill
                  type="submit"
                  title={submitTitle}
                  loading={loading || isLoadingSignIn}
                  className={classNames('w-full', submitClass)}
                />
              </Col>
            )}
          </Row>
        )}
      </Form>
    </div>
  );
};

export default memo(FormWrapper);
