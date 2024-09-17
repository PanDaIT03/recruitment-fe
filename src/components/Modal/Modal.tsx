import { Modal as ModalAntd, ModalProps } from 'antd';

type IProps = {
  isOpen: boolean;
} & ModalProps;

const Modal = ({ isOpen, children, ...props }: IProps) => {
  const customClassNames: ModalProps['classNames'] = {
    content: '!p-0',
    header:
      '!mb-0 !px-[24px] !pt-[20px] !pb-[8px] !border-b-[1px] !border-solid !border-[#e5e7eb]',
    body: '!px-[24px] !pt-[10px] !pb-[20px]',
    footer: '!mt-0 !px-[24px] !py-[20px] !rounded-b-[8px]',
  };

  return (
    <ModalAntd open={isOpen} classNames={customClassNames} {...props}>
      {children}
    </ModalAntd>
  );
};

export default Modal;
