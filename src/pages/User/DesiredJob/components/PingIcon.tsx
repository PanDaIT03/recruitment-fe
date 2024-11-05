import { Flex } from 'antd';
import classNames from 'classnames';
import { memo, useMemo } from 'react';

export enum PING_STATUS {
  PENDING = 'pending',
  SUCCESS = 'success',
}

interface IProps {
  status: 'pending' | 'success';
}

const PingIcon = ({ status }: IProps) => {
  const isStatusSuccess = useMemo(
    () => status === PING_STATUS.SUCCESS,
    [status]
  );

  const coverClassName = classNames(
    'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
    isStatusSuccess ? 'bg-lime-500' : 'bg-blue-500'
  );

  const dotClassName = classNames(
    'relative inline-flex rounded-full h-2 w-2',
    isStatusSuccess ? 'bg-lime-600' : 'bg-blue-600'
  );

  return (
    <div>
      <Flex className="relative w-2 h-2">
        <span className={coverClassName}></span>
        <span className={dotClassName}></span>
      </Flex>
    </div>
  );
};

export default memo(PingIcon);
