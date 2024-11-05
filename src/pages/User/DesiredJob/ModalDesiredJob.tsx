import { ModalProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback } from 'react';
import FormWrapper from '~/components/Form/FormWrapper';
import Modal from '~/components/Modal/Modal';

interface IProps extends ModalProps {
  isOpen: boolean;
}

const ModalDesiredJob = ({ isOpen, ...props }: IProps) => {
  const [form] = useForm();

  const handleFinish = useCallback(() => {
    console.log('finish');
  }, []);

  return (
    <Modal isOpen={isOpen} {...props} title="Cập nhật công việc mong muốn">
      <FormWrapper form={form} onFinish={handleFinish}>
        <p></p>
      </FormWrapper>
    </Modal>
  );
};

export default ModalDesiredJob;
