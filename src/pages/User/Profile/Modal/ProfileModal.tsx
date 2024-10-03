import { Flex, ModalProps } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import classNames from 'classnames';
import { ReactNode } from 'react';

import Button from '~/components/Button/Button';
import FormWrapper from '~/components/Form/FormWrapper';
import Modal from '~/components/Modal/Modal';
import icons from '~/utils/icons';

type IProps = {
  isOpen: boolean;
  children: ReactNode;
  form: FormInstance<any>;
  onCancel: () => void;
  onFinish(values: any): void;
} & ModalProps;

const { CloseOutlined, SaveOutlined } = icons;

const ProfileModal = ({
  form,
  isOpen,
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
      className={customClass}
      footer={
        <Flex gap={16}>
          <Button
            title="Để sau"
            className="basis-1/2"
            iconBefore={<CloseOutlined />}
            onClick={handleCancel}
          />
          <Button
            fill
            title="Lưu"
            className="basis-1/2"
            iconBefore={<SaveOutlined />}
            onClick={() => form.submit()}
          />
        </Flex>
      }
      onCancel={handleCancel}
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
