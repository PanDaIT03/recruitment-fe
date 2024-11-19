import { Switch as SwitchAntD, SwitchProps } from 'antd';
import { memo } from 'react';

interface ISwitchProps extends SwitchProps {}

const Switch = (switchProps: ISwitchProps) => {
  return <SwitchAntD size="small" {...switchProps} />;
};

export default memo(Switch);
