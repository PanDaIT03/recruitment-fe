import { Modal as ModalAntd, ModalProps } from 'antd';
import './Modal.scss';

type AnimationType = 'slide-down' | 'default';

type CustomAnimation = Record<
  AnimationType,
  { maskTransitionName?: string; transitionName?: string }
>;

type IProps = {
  isOpen: boolean;
  animationType?: AnimationType;
} & ModalProps;

const Modal = ({
  isOpen,
  children,
  animationType = 'default',
  ...props
}: IProps) => {
  const customClassNames: ModalProps['classNames'] = {
    content: '!p-0',
    header:
      '!mb-0 !px-[24px] !pt-[20px] !pb-[8px] !border-b-[1px] !border-solid !border-[#e5e7eb]',
    body: '!px-[24px] !pt-[10px] !pb-[20px]',
    footer: '!mt-0 !px-[24px] !py-[20px] !rounded-b-[8px]',
  };

  const customAnimation: CustomAnimation = {
    'slide-down': {
      maskTransitionName: 'custom-mask',
      transitionName: 'custom-modal-slide-down',
    },
    default: {},
  };

  return (
    <ModalAntd
      centered
      open={isOpen}
      classNames={customClassNames}
      {...customAnimation[animationType]}
      {...props}
    >
      {children}
    </ModalAntd>
  );
};

export default Modal;
