import { ConfigProvider, Empty, MappingAlgorithm, SelectProps } from 'antd';
import { AliasToken } from 'antd/es/theme/internal';
import { ComponentToken } from 'antd/lib/select/style';
import classNames from 'classnames';
import { memo, ReactNode, useEffect, useRef, useState } from 'react';

import { NoData } from '~/assets/svg';
import { applyTailwindClass } from '~/utils/functions';
import Icon from '../Icon/Icon';
import './CustomSelect.scss';
import Select from './Select';

type ISelectDisplayedType = 'text' | 'default';
export type ISelectConfigProvider =
  | (Partial<ComponentToken> &
      Partial<AliasToken> & {
        algorithm?: boolean | MappingAlgorithm | MappingAlgorithm[];
      })
  | undefined;

type TProps = {
  prefixIcon?: string | ReactNode;
  displayedType?: ISelectDisplayedType;
  configProvider?: ISelectConfigProvider;
  configTokenProvider?: Partial<AliasToken>;
} & SelectProps;

const CustomerEmptyData = () => {
  return (
    <Empty
      description={<span className="text-admin-primary">Không có dữ liệu</span>}
      image={<NoData />}
      imageStyle={{ height: '70px' }}
    />
  );
};

const CustomSelect = ({
  className,
  prefixIcon,
  configProvider,
  configTokenProvider,
  displayedType = 'default',
  ...props
}: TProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropDownWidth, setDropDownWidth] = useState<number>();

  const customClass = classNames(
    'custom-select',
    'flex pl-[11px] items-center gap-[10px]',
    className,
    displayedType,
    configProvider?.colorBgContainer,
    configProvider?.colorBorder &&
      applyTailwindClass({ type: 'border', value: configProvider.colorBorder })
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
      <ConfigProvider
        theme={{
          components: {
            Select: {
              ...configProvider,
              colorBgContainer: '#2f2f41b3',
              colorIconHover: '#ffac69',
            },
          },
          token: configTokenProvider,
        }}
        renderEmpty={CustomerEmptyData}
      >
        <Select
          popupMatchSelectWidth={false}
          dropdownStyle={{ width: dropDownWidth }}
          getPopupContainer={getPopupContainer}
          {...props}
        />
      </ConfigProvider>
    </div>
  );
};

export default memo(CustomSelect);
