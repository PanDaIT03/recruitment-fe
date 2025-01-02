import { SizeType } from 'antd/es/config-provider/SizeContext';
import { AliasToken } from 'antd/es/theme/internal';

import { ISelectConfigProvider } from '~/components/Select/CustomSelect';

export const SELECT_PROPS = {
  allowClear: true,
  size: 'large' as SizeType,
  className: '!bg-[#2b2b3f]',
  configProvider: {
    clearBg: '#ffffff',
    colorTextQuaternary: '#666666',
    multipleItemBg: '#ffac69',
    multipleItemColor: '#fff',
  } as ISelectConfigProvider,
  configTokenProvider: {
    colorText: '#fff',
    controlItemBgHover: '#ffac69',
    colorTextPlaceholder: '#666666',
  } as Partial<AliasToken>,
};
