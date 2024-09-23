import { SelectProps } from 'antd';
import { memo, ReactNode, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import Icon from '../Icon/Icon';
import './CustomSelect.scss';
import Select from './Select';

type ISelectDisplayedType = 'text' | 'default';

type TProps = {
  colorBgContainer?: string;
  colorBorderContainer?: string;
  prefixIcon?: string | ReactNode;
  displayedType?: ISelectDisplayedType;
} & SelectProps;

const CustomSelect = ({
  prefixIcon,
  colorBgContainer,
  colorBorderContainer,
  displayedType = 'default',
  ...props
}: TProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropDownWidth, setDropDownWidth] = useState<number>();

  const customClass = classNames(
    'custom-select',
    'flex pl-[11px] items-center border rounded-lg',
    displayedType,
    colorBgContainer && `bg-[${colorBgContainer}]`,
    colorBorderContainer && `border-[${colorBorderContainer}]`
  );

  const getPopupContainer = () => containerRef.current!;

  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.offsetWidth;
      setDropDownWidth(width);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div ref={containerRef} className={customClass}>
      <span className="flex">
        {prefixIcon && typeof prefixIcon === 'string' ? (
          <Icon icon={prefixIcon} />
        ) : (
          prefixIcon
        )}
      </span>
      <Select
        popupMatchSelectWidth={false}
        dropdownStyle={{ width: dropDownWidth }}
        getPopupContainer={getPopupContainer}
        {...props}
      />
    </div>
  );
};

export default memo(CustomSelect);
