import { ConfigProvider, Input, InputProps } from 'antd';
import { memo } from 'react';

import classNames from 'classnames';
import icons from '~/utils/icons';

const { EyeTwoTone, EyeInvisibleOutlined } = icons;

const InputPassword = ({ className, ...props }: InputProps) => {
  const { allowClear = false } = props;
  const customClass = classNames('w-full h-10 bg-light-gray', className);

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            hoverBg: '#fafafa',
            activeBg: '#fafafa',
          },
        },
      }}
    >
      <Input.Password
        size="middle"
        allowClear={allowClear}
        className={customClass}
        iconRender={(visible) =>
          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
        }
        {...props}
      />
    </ConfigProvider>
  );
};

export default memo(InputPassword);
