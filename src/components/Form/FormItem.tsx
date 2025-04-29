import { Form, FormItemProps } from 'antd';
import classNames from 'classnames';
import { ReactElement, ReactNode } from 'react';

type IProps = {
  labelBold?: boolean;
  labelClassName?: string;
  childrenSelected?: boolean;
  children: ReactElement | ReactNode;
} & FormItemProps;

const FormItem = ({
  children,
  className,
  labelClassName,
  labelBold = true,
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
        <span
          className={classNames(labelBold ? 'font-medium' : '', labelClassName)}
        >
          {props.label}
        </span>
      }
    >
      {children}
    </Form.Item>
  );
};

export default FormItem;
