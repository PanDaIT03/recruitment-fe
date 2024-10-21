import { Form, FormItemProps } from 'antd';
import classNames from 'classnames';
import { ReactElement } from 'react';

type IProps = {
  children: ReactElement;
  childrenSelected?: boolean;
} & FormItemProps;

const FormItem = ({ children, className, childrenSelected = false, ...props }: IProps) => {
  const customClass = classNames('w-full', className);

  return (
    <Form.Item
      {...props}
      className={customClass}
      initialValue={childrenSelected ? 'all' : undefined}
      label={<span className="font-medium">{props.label}</span>}
    >
      {children}
    </Form.Item>
  );
};

export default FormItem;
