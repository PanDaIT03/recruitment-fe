import classNames from 'classnames';
import React, { memo } from 'react';

interface IContentProps {
  children: React.ReactNode;
  className?: string;
}

const Content = ({ children, className }: IContentProps) => {
  const classes = classNames(
    className,
    'bg-white rounded-lg shadow-md p-5 mt-3'
  );

  return <div className={classes}>{children}</div>;
};

export default memo(Content);
