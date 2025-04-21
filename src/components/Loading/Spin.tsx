import { Spin as SpinAntd } from 'antd';
import { SpinProps } from 'antd/lib';
import classNames from 'classnames';
import { memo } from 'react';
import icons from '~/utils/icons';

const { LoadingOutlined } = icons;

interface IProps extends SpinProps {
  fullHeight?: boolean;
}

const Spin = ({ className, fullHeight = true, ...props }: IProps) => {
  const customClassNames = classNames(
    fullHeight ? 'min-h-[100vh]' : '',
    className
  );

  return (
    <SpinAntd
      size="large"
      className={customClassNames}
      indicator={<LoadingOutlined className="[&>svg]:fill-[#FF5800]" />}
      {...props}
    />
  );
};

export default memo(Spin);
