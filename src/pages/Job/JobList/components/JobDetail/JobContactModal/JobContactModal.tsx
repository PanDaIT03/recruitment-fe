import { Flex, ModalProps, Space } from 'antd';
import { memo } from 'react';

import { Copy } from '~/assets/svg';
import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import Modal from '~/components/Modal/Modal';
import { IUser } from '~/types/Auth';
import icons from '~/utils/icons';

interface IProps extends ModalProps {
  data: IUser;
  isOpen: boolean;
}

const { CloseOutlined } = icons;

const JobContactModal = ({ data, onCancel, ...props }: IProps) => {
  return (
    <Modal
      {...props}
      title="Thông tin liên hệ"
      footer={
        <Button
          title="Đóng"
          className="w-full"
          onClick={onCancel}
          iconBefore={<CloseOutlined />}
        />
      }
      onCancel={onCancel}
    >
      <Space direction="vertical" size="middle" className="w-full">
        <Flex className="text-xsm leading-6">
          <p className="flex-shrink-0 text-sub font-medium min-w-[140px]">
            Tên công ty
          </p>
          <p className="flex-1 font-semibold">{data?.companyName}</p>
        </Flex>
        <Flex className="text-xsm leading-6">
          <p className="flex-shrink-0 text-sub font-medium min-w-[140px]">
            Email
          </p>
          <Flex align="center" className="flex-1 font-semibold">
            {data?.email}
            <ButtonAction
              tooltipTitle="Sao chép"
              className="!p-0 hover:bg-transparent"
              title={<Copy className="h-4 w-4 stroke-2 stroke-primary" />}
              onClick={() => navigator.clipboard.writeText(data?.email)}
            />
          </Flex>
        </Flex>
      </Space>
    </Modal>
  );
};

export default memo(JobContactModal);
