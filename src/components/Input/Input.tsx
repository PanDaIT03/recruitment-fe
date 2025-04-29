import { ConfigProvider, Input as InputAntd, InputProps } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';
import './Input.scss';

const Input = ({ className, allowClear = false, ...props }: InputProps) => {
  const customClass = classNames('w-full h-10', className);

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            colorBgContainer: '#fafafa',
          },
        },
      }}
    >
      <InputAntd
        size="middle"
        allowClear={allowClear}
        className={customClass}
        {...props}
      />
    </ConfigProvider>
  );
};

export default memo(Input);
