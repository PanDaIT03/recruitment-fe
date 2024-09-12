import classNames from 'classnames/bind';
import { ReactNode, memo } from 'react';
import { Spin } from 'antd';
import styles from './Button.module.scss';

type ButtonType = 'button' | 'submit' | 'reset';
type DisplayType = 'error' | 'approve' | 'primary' | 'text';
type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;

interface IProps {
  fill?: boolean;
  title: ReactNode;
  type?: ButtonType;
  className?: string;
  loading?: boolean;
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
  loading = false,
  ...props
}: IProps) => {
  const clasess = cx('button', 'rounded-md transition duration-300', {
    fill,
    [className]: className,
    [displayType]: displayType,
  });

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clasess}
      {...props}
    >
      {loading ? (
        <Spin size="small" />
      ) : (
        <>
          {iconBefore && <span className="flex mr-3">{iconBefore}</span>}
          <b>{title}</b>
        </>
      )}
    </button>
  );
};

export default memo(Button);
