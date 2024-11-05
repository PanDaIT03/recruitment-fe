import { Divider, Flex, Image, Space, Tag } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { NetWorking } from '~/assets/img';
import { Work } from '~/assets/svg';
import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import PingIcon from './components/PingIcon';
import ModalDesiredJob from './ModalDesiredJob';

interface IDesiredJobInfo {
  title: string;
  content: ReactNode;
}

const { PlusOutlined, EditOutlined } = icons;

const DesiredJob = () => {
  const navigate = useNavigate();

  const [state, setState] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const desiredJobInfo: IDesiredJobInfo[] = useMemo(() => {
    return [
      {
        title: 'Lĩnh vực',
        content: 'IT - Phần mềm',
      },
      {
        title: 'Vị trí ứng tuyển',
        content: <Tag color="magenta">FE Dev</Tag>,
      },
      {
        title: 'Địa điểm',
        content: 'Hồ Chí Minh',
      },
      {
        title: 'Mức lương kỳ vọng',
        content: <Tag color="green">8tr VND</Tag>,
      },
      {
        title: 'Thời gian bắt đầu',
        content: '30 ngày',
      },
    ];
  }, []);

  useEffect(() => {
    setState(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={8}>
          <Work />
          <h2 className="text-base font-bold">Công việc mong muốn</h2>
        </Flex>
        <ButtonAction
          tooltipTitle="Cập nhật"
          title={<EditOutlined className="text-[#691f74] cursor-pointer" />}
          onClick={() => setIsOpen(true)}
        />
      </Flex>
      <Divider className="!my-3" />
      {state ? (
        <>
          <Space direction="vertical" className="w-full p-2" size="middle">
            {desiredJobInfo.map((item, index) => (
              <Flex key={index} align="center" justify="space-between">
                <p className="text-sm text-sub leading-6 font-medium">
                  {item.title}
                </p>
                <p className="text-sm font-medium">{item.content}</p>
              </Flex>
            ))}
          </Space>
          <Divider dashed />
          <Flex
            align="center"
            justify="space-between"
            className="px-2 pb-4 pt-2"
          >
            <p className="text-sm text-sub leading-6 font-medium">
              Trạng thái chia sẻ
            </p>
            <Flex align="center" justify="center" gap={8}>
              <PingIcon status="pending" />
              {/* <p className="text-sm text-success font-medium">
                Chia sẻ vào 16 tháng 10
              </p> */}
              <p className="text-sm text-[#2563EB] font-medium">Đang duyệt</p>
            </Flex>
          </Flex>
        </>
      ) : (
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
      )}
      <ModalDesiredJob isOpen={isOpen} onCancel={handleCancel} />
    </>
  );
};

export default DesiredJob;
