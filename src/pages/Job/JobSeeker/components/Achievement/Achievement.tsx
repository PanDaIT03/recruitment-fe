import classNames from 'classnames';
import { CSSProperties, memo, useState } from 'react';

import Button from '~/components/Button/Button';

interface IProps {
  value: string;
  className?: string;
}

const Achievement = ({ value, className }: IProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const requirementsArr = value?.split('\n');

  const customClass = classNames('w-full', className);
  const lineClampStyle: CSSProperties = {
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: isVisible ? 'unset' : '3',
  };
  // const lineClampClass = classNames(
  //   'font-medium whitespace-pre-wrap overflow-hidden',
  //   isVisible ? 'line-clamp-none' : 'line-clamp-[3] lg:line-clamp-6'
  // );

  return (
    <div className={customClass}>
      <div style={lineClampStyle} className="font-medium whitespace-pre-wrap">
        {requirementsArr.map((req, index) => (
          <div
            key={index}
            className="before:text-lg before:mr-1 before:content-['-'] lg:before:content-['•']"
          >
            {req}
          </div>
        ))}
      </div>
      <Button
        displayType="text"
        title={isVisible ? 'Thu gọn' : 'Xem thêm'}
        className="text-accent font-medium hover:text-[#CC3E02] hover:underline"
        onClick={() => setIsVisible(!isVisible)}
      />
    </div>
  );
};

export default memo(Achievement);
