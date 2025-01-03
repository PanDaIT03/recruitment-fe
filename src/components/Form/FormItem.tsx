import { Form, FormItemProps } from 'antd';
import classNames from 'classnames';
import { ReactElement } from 'react';

type IProps = {
  children: ReactElement;
  labelClassName?: string;
  childrenSelected?: boolean;
} & FormItemProps;

const FormItem = ({
  children,
  className,
  labelClassName,
  childrenSelected = false,
  ...props
}: IProps) => {
  const customClass = classNames('w-full', className);

  return (
    <Form.Item
      {...props}
      className={customClass}
      labelCol={{ span: props.label ? 24 : 0 }}
      initialValue={childrenSelected ? 'all' : undefined}
      label={
        <span className={classNames('font-medium', labelClassName)}>
          {props.label}
        </span>
      }
    >
      {children}
    </Form.Item>
  );
};

export default FormItem;
