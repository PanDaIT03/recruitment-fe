import { Tooltip } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';
import Button, { IButtonProps } from './Button';

export type ButtonShape = 'circle' | 'default';

interface IProps extends IButtonProps {
  shape?: ButtonShape;
  tooltipTitle?: string;
}

const ButtonAction = ({
  title,
  className,
  tooltipTitle,
  shape = 'circle',
  ...props
}: IProps) => {
  const customClasses = classNames(
    shape === 'circle'
      ? 'px-3 py-2 border-none !rounded-[50%] hover:bg-button-color hover:opacity-100'
      : '',
    className
  );

  return (
    <Tooltip title={tooltipTitle}>
      <Button title={title} className={customClasses} {...props} />
    </Tooltip>
  );
};

export default memo(ButtonAction);
