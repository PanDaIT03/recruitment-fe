import * as Icons from '@ant-design/icons';
import { Image } from 'antd';
import { memo } from 'react';
import { ICON_TYPE } from '~/utils/enums';

interface MenuIconProps {
  icon: string;
  iconType: string;
  className?: string;
}

const HeaderMenuIcon = ({ iconType, icon, className = '' }: MenuIconProps) => {
  const IconComponent = (Icons as any)[icon] || Icons.AppstoreOutlined;

  return (
    <>
      {iconType === ICON_TYPE.IMAGE ? (
        <Image
          src={icon}
          preview={false}
          alt="menu-icon"
          className={`!w-4 !h-4 mr-2 object-contain ${className}`}
        />
      ) : (
        <IconComponent className={className} />
      )}
    </>
  );
};

export default memo(HeaderMenuIcon);
