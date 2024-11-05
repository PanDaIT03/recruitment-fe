import { ModalProps } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import classNames from 'classnames';
import { ReactNode } from 'react';

import FormWrapper from '~/components/Form/FormWrapper';
import Modal from '~/components/Modal/Modal';

type IProps = {
  isOpen: boolean;
  loading?: boolean;
  children: ReactNode;
  form: FormInstance<any>;
  onCancel: () => void;
  onFinish(values: any): void;
} & ModalProps;

const ProfileModal = ({
  form,
  isOpen,
  loading,
  children,
  onCancel,
  onFinish,
  className,
  ...props
}: IProps) => {
  const customClass = classNames('max-w-md', className);

  const handleFinish = (values: any) => {
    onFinish(values);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      centered
      isOpen={isOpen}
      loading={loading}
      className={customClass}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      {...props}
    >
      <FormWrapper
        form={form}
        onFinish={handleFinish}
        className="flex flex-col gap-[6px]"
      >
        {children}
      </FormWrapper>
    </Modal>
  );
};

export default ProfileModal;
