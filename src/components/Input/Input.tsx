import { Input as InputAntd, InputProps } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

const Input = ({className, ...props}: InputProps) => {
  const { allowClear = false } = props;
  const customClass = classNames('w-full h-10', className);

  return (
    <InputAntd
      size="middle"
      allowClear={allowClear}
      className={customClass}
      {...props}
    />
  );
};

export default memo(Input);
