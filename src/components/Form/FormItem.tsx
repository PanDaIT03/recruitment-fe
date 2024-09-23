import { Form, FormItemProps } from 'antd';
import classNames from 'classnames';
import { ReactElement } from 'react';

type IProps = {
  children: ReactElement;
  childrenSelected?: boolean;
} & FormItemProps;

const FormItem = ({ children, childrenSelected = false, ...props }: IProps) => {
  const customClass = classNames('w-full mb-3', props.className);

  return (
    <Form.Item
      className={customClass}
      initialValue={childrenSelected ? 'all' : undefined}
      {...props}
    >
      {children}
    </Form.Item>
  );
};

export default FormItem;
