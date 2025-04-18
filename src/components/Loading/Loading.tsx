import { Flex } from 'antd';
import { HeaderLogoFillColor } from '~/assets/svg';
import Spin from './Spin';

const Loading = () => {
  return (
    <Flex
      vertical
      gap={32}
      align="center"
      justify="center"
      className="min-h-screen mt-auto bg-gray-100"
    >
      <Flex vertical align="center" gap={16}>
        <HeaderLogoFillColor className="max-w-[139px] h-full" />
        <p className="font-semibold">
          Đang xử lý... Vui lòng đợi trong giây lát
        </p>
      </Flex>
      <Spin fullHeight={false} />
    </Flex>
  );
};

export default Loading;
