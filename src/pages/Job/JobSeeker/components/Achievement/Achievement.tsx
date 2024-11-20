import classNames from 'classnames/bind';
import { memo, useState } from 'react';

import Button from '~/components/Button/Button';
import styles from './Achievement.module.scss';

const cx = classNames.bind(styles);

interface IProps {
  value: string;
}

const Achievement = ({ value }: IProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const requirementsArr = value?.split('\n');

  return (
    <div className="w-full">
      <div className={cx('content-container', isVisible ? 'expanded' : '')}>
        {requirementsArr.map((req, index) => (
          <div
            key={index}
            className={cx(
              'requirement-item',
              'before:text-lg before:mr-1 before:content-["-"] lg:before:content-["•"]'
            )}
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
