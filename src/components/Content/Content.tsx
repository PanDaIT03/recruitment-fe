import classNames from 'classnames';
import { memo, ReactNode } from 'react';

interface IContentProps {
  isOpen?: boolean;
  children: ReactNode;
  className?: string;
}

const Content = ({ isOpen = true, children, className }: IContentProps) => {
  const classes = classNames(
    className,
    !isOpen && 'hidden',
    'bg-white rounded-lg shadow-md p-5 mt-3'
  );

  return <div className={classes}>{children}</div>;
};

export default memo(Content);
