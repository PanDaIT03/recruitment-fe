import { Spin } from 'antd';
import classNames from 'classnames/bind';
import { ReactNode, memo } from 'react';

import icons from '~/utils/icons';
import styles from './Button.module.scss';

const { LoadingOutlined } = icons;

type ButtonBorderType = 'solid' | 'dashed';
type ButtonType = 'button' | 'submit' | 'reset';
type DisplayType = 'error' | 'approve' | 'primary' | 'text' | 'dashed';
type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;

export interface IButtonProps {
  fill?: boolean;
  title: ReactNode;
  type?: ButtonType;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
  displayType?: DisplayType;
  borderType?: ButtonBorderType;
  onClick?: ButtonClickHandler;
  onMouseEnter?: ButtonClickHandler;
  onMouseLeave?: ButtonClickHandler;
}

const cx = classNames.bind(styles);

const Button = ({
  title,
  disabled,
  iconBefore,
  iconAfter,
  fill = false,
  className = '',
  type = 'button',
  borderType = 'solid',
  displayType = 'primary',
  loading = false,
  ...props
}: IButtonProps) => {
  const classes = cx('button', 'rounded-md transition duration-300', {
    fill,
    [className]: className,
    [borderType]: borderType,
    [displayType]: displayType,
  });

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      <div className="flex items-center gap-3">
        {loading ? <Spin indicator={<LoadingOutlined />} /> : iconBefore}
        <b className="w-max">{title}</b>
        {iconAfter}
      </div>
    </button>
  );
};

export default memo(Button);
