import { InputNumber as AntdInputNumber } from 'antd';
import { InputNumberProps } from 'antd/lib';
import classNames from 'classnames';

const InputNumber = ({className, ...props}: InputNumberProps) => {
  const customClass = classNames('w-full h-10 leading-10', className);

  return (
    <AntdInputNumber
      size="middle"
      className={customClass}
      {...props}
    />
  );
};

export default InputNumber;
