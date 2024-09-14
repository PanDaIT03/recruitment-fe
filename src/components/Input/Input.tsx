import { Input, InputProps } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

const InputForm = (props: InputProps) => {
  const { allowClear = false } = props;
  const customClass = classNames('w-full h-10', props.className);

  return (
    <Input
      size="middle"
      allowClear={allowClear}
      className={customClass}
      {...props}
    />
  );
};

export default memo(InputForm);
