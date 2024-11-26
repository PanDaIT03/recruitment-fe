import { Space } from 'antd';

import Confetti_Icon from '~/assets/animations/confetti.json';
import LordIcon from '../Icon/LordIcon';
import Modal, { IModalProps } from './Modal';

interface IProps extends IModalProps {
  icon?: any;
}

const CongratulationModal = ({
  children,
  icon = Confetti_Icon,
  ...props
}: IProps) => {
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
        <LordIcon animationData={icon} className="h-40 w-40" />
        {children}
      </Space>
    </Modal>
  );
};

export default CongratulationModal;
