import { memo, ReactNode, useCallback, useState } from 'react';
import { Copy } from '~/assets/svg';
import { IButtonProps } from './Button';
import ButtonAction, { ButtonShape } from './ButtonAction';

type ButtonProps = Omit<IButtonProps, 'title'>;

interface IProps extends ButtonProps {
  value: string;
  title?: ReactNode;
  shape?: ButtonShape;
}

const initState = 'Sao chép';

const CopyButton = ({ value, title, ...props }: IProps) => {
  const [tooltipTitle, setToolTipTitle] = useState(initState);

  const handleClick = useCallback(() => {
    setToolTipTitle('Đã sao chép');
    navigator.clipboard.writeText(value);

    setTimeout(() => setToolTipTitle(initState), 2000);
  }, [value]);

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
