import { Radio as AntdRadio, RadioGroupProps, RadioProps } from 'antd';
import { memo } from 'react';

import './Radio.scss';

const Radio = memo(({ ...props }: RadioProps) => {
  return <AntdRadio {...props} />;
});

const RadioGroup = memo((props: RadioGroupProps) => {
  return <AntdRadio.Group {...props} />;
});

export { Radio, RadioGroup };
