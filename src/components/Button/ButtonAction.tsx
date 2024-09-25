import { memo } from 'react';
import Button, { IButtonProps } from './Button';
import classNames from 'classnames';

const ButtonAction = ({ className, ...props }: IButtonProps) => {
  const classNames = `text-`;

  //   const customClasses = classNames(
  //     'border-none px- hover:bg-button-color hover:opacity-100 rounded-full',
  //     className
  //   );

  //   return <Button className={customClasses} {...props} />;
  return <Button className={'px-'} {...props} />;
};

export default memo(ButtonAction);
