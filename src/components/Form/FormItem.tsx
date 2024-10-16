import { Form, FormItemProps } from 'antd';
import classNames from 'classnames';
import { ReactElement } from 'react';

type IProps = {
  children: ReactElement;
  childrenSelected?: boolean;
} & FormItemProps;

const FormItem = ({ children, childrenSelected = false, ...props }: IProps) => {
  const customClass = classNames('w-full', props.className);

  return (
    <Form.Item
      {...props}
      className={customClass}
      initialValue={childrenSelected ? 'all' : undefined}
    >
      {children}
    </Form.Item>
  );
};

export default FormItem;
