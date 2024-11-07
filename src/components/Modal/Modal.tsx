import { Flex, Modal as ModalAntd, ModalProps } from 'antd';

import icons from '~/utils/icons';
import Button from '../Button/Button';
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

const customAnimation: CustomAnimation = {
  'slide-down': {
    maskTransitionName: 'custom-mask',
    transitionName: 'custom-modal-slide-down',
  },
  default: {},
};

const { CloseOutlined, SaveOutlined } = icons;

const Modal = ({
  isOpen,
  children,
  loading,
  classNames,
  animationType = 'default',
  onOk,
  onCancel,
  ...props
}: IProps) => {
  const { transitionName } = customAnimation[animationType];

  const combinedProps = {
    ...props,
    ...customAnimation[animationType],
  };

  const customClassNames: ModalProps['classNames'] = {
    content: `!p-0 ${transitionName}-${isOpen ? 'enter' : 'leave'}`, // This ensures the Modal has an opening animation even on first render
    header:
      '!mb-0 !px-[24px] !pt-[20px] !pb-[8px] !border-b-[1px] !border-solid !border-[#e5e7eb]',
    body: 'max-h-[70vh] overflow-auto !px-[24px] !pt-[10px] !pb-[20px]',
    footer: '!mt-0 !px-[24px] !py-[20px] !rounded-b-[8px]',
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
              title="Để sau"
              disabled={loading}
              className="basis-1/2"
              iconBefore={<CloseOutlined />}
              onClick={onCancel}
            />
            <Button
              fill
              title="Lưu"
              loading={loading}
              disabled={loading}
              className="basis-1/2"
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
