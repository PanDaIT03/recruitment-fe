import { Spin } from 'antd';
import classNames from 'classnames/bind';
import { ReactNode, memo, useMemo } from 'react';

import icons from '~/utils/icons';
import styles from './Button.module.scss';

const { LoadingOutlined } = icons;

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
  iconAfter?: ReactNode;
  displayType?: DisplayType;
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
  displayType = 'primary',
  loading = false,
  ...props
}: IProps) => {
  const classes = cx('button', 'rounded-md transition duration-300', {
    fill,
    [className]: className,
    [displayType]: displayType,
  });

  const buttonState = useMemo(() => {
    return {
      loading: loading && displayType !== 'text',
      disabled: (disabled || loading) && displayType !== 'text',
    };
  }, [loading, disabled]);

  return (
    <button
      type={type}
      className={classes}
      disabled={buttonState.disabled}
      {...props}
    >
      {buttonState.loading ? (
        <Spin indicator={<LoadingOutlined />} />
      ) : (
        <div className="flex gap-3">
          {iconBefore}
          <b>{title}</b>
          {iconAfter}
        </div>
      )}
    </button>
  );
};

export default memo(Button);
