import { FormInstance } from 'antd';
import { memo } from 'react';

import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import Modal, { IModalProps } from '~/components/Modal/Modal';
import Select from '~/components/Select/Select';
import { iconTypeOptions } from './Menu';

interface IProps extends IModalProps {
  form: FormInstance;
  onFinish: (values: any) => void;
}

const ModalMenu = ({ form, onFinish, ...props }: IProps) => {
  return (
    <Modal {...props}>
      <FormWrapper form={form} onFinish={onFinish}>
        <FormItem label="Tên menu">
          <Input />
        </FormItem>
        <FormItem label="Path">
          <Input />
        </FormItem>
        <FormItem label="Order index">
          <Input type="number" />
        </FormItem>
        <FormItem label="Loại icon">
          <Select options={iconTypeOptions} />
        </FormItem>
      </FormWrapper>
    </Modal>
  );
};

export default memo(ModalMenu);
