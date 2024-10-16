import { Input as InputAntd, InputProps } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

const Input = (props: InputProps) => {
  const { allowClear = false } = props;
  const customClass = classNames('w-full h-10', props.className);

  return (
    <InputAntd
      size="middle"
      allowClear={allowClear}
      {...props}
      className={customClass}
    />
  );
};

export default memo(Input);
