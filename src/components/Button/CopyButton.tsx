import { message } from 'antd';
import { memo, ReactNode, useCallback } from 'react';

import { Copy } from '~/assets/svg';
import { IButtonProps } from './Button';
import ButtonAction, { ButtonShape } from './ButtonAction';

type ButtonProps = Omit<IButtonProps, 'title'>;

interface IProps extends ButtonProps {
  value: string;
  title?: ReactNode;
  tooltipTitle?: string;
  shape?: ButtonShape;
}

const CopyButton = ({
  value,
  title,
  tooltipTitle = 'Sao chép',
  ...props
}: IProps) => {
  const handleClick = useCallback(() => {
    message.success('Đã sao chép');
    navigator.clipboard.writeText(value);
  }, []);

  return (
    <ButtonAction
      className="!p-2"
      title={title || <Copy />}
      tooltipTitle={tooltipTitle}
      onClick={handleClick}
      {...props}
    />
  );
};

export default memo(CopyButton);
