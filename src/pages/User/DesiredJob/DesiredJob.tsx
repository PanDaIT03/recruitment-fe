import { Divider, Flex, Image } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { useNavigate } from 'react-router-dom';

import { NetWorking } from '~/assets/img';
import Button from '~/components/Button/Button';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { PlusOutlined } = icons;

const DesiredJob = () => {
  const navigate = useNavigate();

  return (
    <>
      <h2 className="text-base font-bold">Công việc mong muốn</h2>
      <Divider className="!my-3" />
      <Flex vertical align="center" justify="center" className="gap-4">
        <Image
          width={112}
          height={112}
          preview={false}
          src={NetWorking}
          className="rounded-full p-4 bg-gray-100"
        />
        <Paragraph className="text-center text-sm text-sub italic max-w-md">
          Tạo hồ sơ tìm việc để kết nối với Nhà tuyển dụng
        </Paragraph>
        <Button
          fill
          title="Khởi tạo"
          iconBefore={<PlusOutlined />}
          onClick={() => navigate(PATH.USER_JOB_APPLICATION)}
        />
      </Flex>
    </>
  );
};

export default DesiredJob;
