import React from 'react';
import { Modal, Divider, Typography } from 'antd';
import Button from '~/components/Button/Button';

const { Title } = Typography;

interface LoginModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onOk: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isVisible,
  onCancel,
  onOk,
}) => {
  return (
    <Modal
      open={isVisible}
      footer={false}
      className="flex justify-center items-center min-h-[50%]"
      onCancel={onCancel}
    >
      <Title level={4}>Thông báo</Title>
      <Divider />
      <p className="text-center text-lg font-bold">
        Bạn cần đăng nhập để sử dụng chức năng tuyển dụng.
      </p>
      <Divider />
      <div className="flex mt-4 gap-2">
        <Button title="Hủy" onClick={onCancel} className="w-full" />
        <Button title="Đăng nhập" fill onClick={onOk} className="w-full" />
      </div>
    </Modal>
  );
};

export default LoginModal;
