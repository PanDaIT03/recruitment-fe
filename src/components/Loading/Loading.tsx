import { Flex, Spin } from 'antd';
import { HeaderLogoFillColor } from '~/assets/svg';
import icons from '~/utils/icons';

const { LoadingOutlined } = icons;

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
        <HeaderLogoFillColor className="max-w-[139px] h-full object-cover cursor-pointer" />
        <p className="font-semibold">
          Đang xử lý... Vui lòng đợi trong giây lát
        </p>
      </Flex>
      <Spin
        size="large"
        indicator={<LoadingOutlined className="[&>svg]:fill-[#FF5800]" />}
      />
    </Flex>
  );
};

export default Loading;
