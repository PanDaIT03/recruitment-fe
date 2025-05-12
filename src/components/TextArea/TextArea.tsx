import { Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import classNames from 'classnames';
import { memo } from 'react';

const { TextArea: AntdTextArea } = Input;

const TextArea = ({ className, ...props }: TextAreaProps) => {
  const customClass = classNames('!min-h-20 py-1 bg-[#FAFAFA]', className);

  return <AntdTextArea className={customClass} {...props} />;
};

export default memo(TextArea);
