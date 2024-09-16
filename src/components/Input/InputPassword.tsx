import { Input, InputProps } from 'antd';
import { memo } from 'react';

import classNames from 'classnames';
import icons from '~/utils/icons';

const { EyeTwoTone, EyeInvisibleOutlined } = icons;

const InputPassword = (props: InputProps) => {
  const { allowClear = false } = props;
  const customClass = classNames('w-full h-10', props.className);

  return (
    <Input.Password
      size="middle"
      allowClear={allowClear}
      className={customClass}
      iconRender={(visible) =>
        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
      }
      {...props}
    />
  );
};

export default memo(InputPassword);
