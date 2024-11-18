import { ReactNode, useCallback, useState } from 'react';
import { Copy } from '~/assets/svg';
import ButtonAction from './ButtonAction';

interface IProps {
  value: string;
  title?: ReactNode;
}

const initState = 'Sao chép';

const CopyButton = ({ value, title }: IProps) => {
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
    />
  );
};

export default CopyButton;
