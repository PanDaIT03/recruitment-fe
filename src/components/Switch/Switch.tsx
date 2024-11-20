import { ConfigProvider, Switch as SwitchAntD, SwitchProps } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

interface ISwitchProps extends SwitchProps {}

const Switch = (switchProps: ISwitchProps) => {
  const classes = classNames(classNames, '');

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ffac69',
        },
      }}
    >
      <SwitchAntD size="small" {...switchProps} className={classes} />
    </ConfigProvider>
  );
};

export default memo(Switch);
