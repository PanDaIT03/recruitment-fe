import { Form, FormItemProps } from 'antd';
import classNames from 'classnames';
import { ReactElement } from 'react';

type IProps = {
  children: ReactElement;
  childrenSelected?: boolean;
} & FormItemProps;

const FormItem = ({
  label,
  children,
  className,
  childrenSelected = false,
  ...props
}: IProps) => {
  const customClass = classNames('w-full', className);

  return (
    <Form.Item
      className={customClass}
      labelCol={{ span: label ? 24 : 0 }}
      initialValue={childrenSelected ? 'all' : undefined}
      label={<span className="font-medium">{label}</span>}
      {...props}
    >
      {children}
    </Form.Item>
  );
};

export default FormItem;
