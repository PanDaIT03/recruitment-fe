import classNames from 'classnames/bind';
import { ReactNode, memo } from 'react';

import styles from './Button.module.scss';

type ButtonType = 'button' | 'submit' | 'reset';
type DisplayType = 'error' | 'approve' | 'primary' | 'text';
type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;

interface IProps {
  fill?: boolean;
  title: ReactNode;
  type?: ButtonType;
  className?: string;
  disabled?: boolean;
  iconBefore?: ReactNode;
  displayType?: DisplayType;
  onClick?: ButtonClickHandler;
  onMouseEnter?: ButtonClickHandler;
  onMouseLeave?: ButtonClickHandler;
}

const cx = classNames.bind(styles);

const Button = ({
  title,
  type,
  disabled,
  iconBefore,
  fill = false,
  className = '',
  displayType = 'primary',
  ...props
}: IProps) => {
  const clasess = cx('button', 'rounded-md transition duration-300', {
    fill,
    [className]: className,
    [displayType]: displayType,
  });

  return (
    <button type={type} disabled={disabled} className={clasess} {...props}>
      {iconBefore && <span className="flex mr-2">{iconBefore}</span>}
      <b>{title}</b>
    </button>
  );
};

export default memo(Button);
