import { Flex } from 'antd';
import { FormInstance } from 'antd/lib';
import { memo } from 'react';

import Button from '~/components/Button/Button';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Modal, { IModalProps } from '~/components/Modal/Modal';
import TextArea from '~/components/TextArea/TextArea';
import { IRejectedForm } from './CandidateProfile';

interface IProps extends IModalProps {
  form: FormInstance<IRejectedForm>;
  onFinish: (values: IRejectedForm) => void;
}

const ModalRejectProfile = ({
  form,
  loading,
  onCancel,
  onFinish,
  ...props
}: IProps) => {
  return (
    <Modal
      title="Lý do từ chối"
      footer={
        <Flex gap={8} align="center" justify="end">
          <Button title="Hủy" loading={loading} onClick={onCancel} />
          <Button
            fill
            title="Xác nhận"
            loading={loading}
            onClick={() => form.submit()}
          />
        </Flex>
      }
      onCancel={onCancel}
      {...props}
    >
      <FormWrapper form={form} onFinish={onFinish}>
        <FormItem
          label="Lý do"
          name="reason"
          rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}
        >
          <TextArea placeholder="Lý do từ chối..." />
        </FormItem>
      </FormWrapper>
    </Modal>
  );
};

export default memo(ModalRejectProfile);
