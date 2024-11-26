import { Space } from 'antd';

import Confetti_Icon from '~/assets/animations/confetti.json';
import LordIcon from '../Icon/LordIcon';
import Modal, { IModalProps } from './Modal';

const CongratulationModal = ({ children, ...props }: IModalProps) => {
  return (
    <Modal
      destroyOnClose
      closable={false}
      animationType="slide-down"
      {...props}
    >
      <Space
        size="small"
        align="center"
        direction="vertical"
        className="w-full"
      >
        <LordIcon animationData={Confetti_Icon} className="h-40 w-40" />
        {children}
      </Space>
    </Modal>
  );
};

export default CongratulationModal;
