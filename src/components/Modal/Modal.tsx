import { Flex, Modal as ModalAntd, ModalProps } from 'antd';

import icons from '~/utils/icons';
import Button from '../Button/Button';
import './Modal.scss';

type AnimationType = 'slide-down' | 'default';

type CustomAnimation = Record<
  AnimationType,
  { maskTransitionName?: string; transitionName?: string }
>;

export interface IModalProps extends ModalProps {
  isOpen: boolean;
  scroll?: boolean;
  animationType?: AnimationType;
}

const customAnimation: CustomAnimation = {
  'slide-down': {
    transitionName: 'custom-modal-slide-down',
  },
  default: {},
};

const { CloseOutlined, SaveOutlined } = icons;

const Modal = ({
  isOpen,
  scroll,
  children,
  loading,
  classNames,
  destroyOnClose,
  okText,
  cancelText,
  animationType = 'default',
  onOk,
  onCancel,
  ...props
}: IModalProps) => {
  const { transitionName } = customAnimation[animationType];

  const combinedProps = {
    ...props,
    ...customAnimation[animationType],
  };

  const customClassNames: ModalProps['classNames'] = {
    content: `!p-0 ${transitionName}-${isOpen ? 'enter' : 'leave'}`, // This ensures the Modal has an opening animation even on first render
    header:
      '!mb-0 !px-[24px] !pt-[20px] !pb-[8px] !border-b-[1px] !border-solid !border-[#e5e7eb]',
    body: `!px-[24px] !py-[20px] ${scroll ? 'max-h-[70vh] overflow-auto' : ''}`,
    footer: '!mt-0 !px-[24px] !pt-[10px] !pb-[20px] !rounded-b-[8px]',
    ...classNames,
  };

  return (
    <ModalAntd
      open={isOpen}
      classNames={customClassNames}
      footer={
        props.footer || (
          <Flex gap={16}>
            <Button
              disabled={loading}
              className="basis-1/2"
              title={cancelText || 'Để sau'}
              iconBefore={<CloseOutlined />}
              onClick={onCancel}
            />
            <Button
              fill
              loading={loading}
              disabled={loading}
              className="basis-1/2"
              title={okText || 'Lưu'}
              iconBefore={<SaveOutlined />}
              onClick={onOk}
            />
          </Flex>
        )
      }
      onCancel={onCancel}
      {...combinedProps}
    >
      {children}
    </ModalAntd>
  );
};

export default Modal;
