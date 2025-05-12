import { Flex } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';
import { PING_STATUS } from '~/enums';

interface IProps {
  status: 'pending' | 'success' | 'error';
}

const PingIcon = ({ status }: IProps) => {
  const coverClassName = classNames(
    'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
    status === PING_STATUS.SUCCESS
      ? 'bg-lime-500'
      : status === PING_STATUS.ERROR
        ? 'bg-red-500'
        : 'bg-blue-500'
  );

  const dotClassName = classNames(
    'relative inline-flex rounded-full h-2 w-2',
    status === PING_STATUS.SUCCESS
      ? 'bg-lime-600'
      : status === PING_STATUS.ERROR
        ? 'bg-red-600'
        : 'bg-blue-600'
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
