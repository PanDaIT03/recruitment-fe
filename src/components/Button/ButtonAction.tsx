import { memo } from 'react';
import Button, { IButtonProps } from './Button';
import classNames from 'classnames';

const ButtonAction = ({ title, className, ...props }: IButtonProps) => {
  const customClasses = classNames(
    'px-3 py-2 border-none !rounded-[50%] hover:bg-button-color hover:opacity-100',
    className
  );

  return <Button title={title} className={customClasses} {...props} />;
};

export default memo(ButtonAction);
