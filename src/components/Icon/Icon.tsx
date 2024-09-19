import { Image } from 'antd';

interface IProps {
  icon: string;
  width?: number;
  height?: number;
  className?: string;
}

const Icon = ({ icon, width = 24, height = 24, ...props }: IProps) => {
  return (
    <Image
      src={icon}
      width={width}
      height={height}
      preview={false}
      {...props}
    />
  );
};

export default Icon;
