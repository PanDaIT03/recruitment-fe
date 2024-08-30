import { Input, InputProps } from 'antd';
import classNames from 'classnames';

const InputForm = (props: InputProps) => {
  const customClass = classNames('w-full h-10', props.className);

  return <Input allowClear size="middle" className={customClass} {...props} />;
};

export default InputForm;
