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
  disabled?: boolean;
  customClass?: string;
  iconBefore?: ReactNode;
  displayType?: DisplayType;
  handleOnclick?: ButtonClickHandler;
  handleOnMouseEnter?: ButtonClickHandler;
  handleOnMouseLeave?: ButtonClickHandler;
}

const cx = classNames.bind(styles);

const Button = ({
  title,
  type,
  disabled,
  iconBefore,
  fill = false,
  customClass = '',
  displayType = 'primary',
  handleOnclick,
  handleOnMouseEnter,
  handleOnMouseLeave,
}: IProps) => {
  const clasess = cx('button', 'rounded-md transition duration-300', {
    fill,
    [customClass]: customClass,
    [displayType]: displayType,
  });

  return (
    <button
      type={type}
      disabled={disabled}
      className={clasess}
      onClick={handleOnclick}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      {iconBefore && <span className="mr-2">{iconBefore}</span>}
      <b>{title}</b>
    </button>
  );
};

export default memo(Button);
