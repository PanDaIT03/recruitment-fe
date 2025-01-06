import { Modal, ModalProps } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

const AdminModal = ({ className, ...props }: ModalProps) => {
  const customClass = classNames(
    '[&>div>.ant-modal-content>.ant-modal-close>.ant-modal-close-x>.ant-modal-close-icon]:!text-white',
    className
  );

  const customClassNames: ModalProps['classNames'] = {
    content: '!bg-[#2f2f41]',
    header: '!bg-[#2f2f41] [&>.ant-modal-title]:text-white',
    ...props.classNames,
  };

  return (
    <Modal className={customClass} {...props} classNames={customClassNames} />
  );
};

export default memo(AdminModal);
