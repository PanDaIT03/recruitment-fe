import { Flex, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useState } from 'react';

import { Fly } from '~/assets/svg';
import Button from '~/components/Button/Button';
import Dragger from '~/components/Dragger/Dragger';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Modal, { IModalProps } from '~/components/Modal/Modal';
import { Radio, RadioGroup } from '~/components/Radio/Radio';
import Select from '~/components/Select/Select';
import icons from '~/utils/icons';

const { CloseOutlined } = icons;

const JobApplyModal = ({ onCancel, ...props }: IModalProps) => {
  const [form] = useForm();
  const [value, setValue] = useState(1);

  const handleFinish = (values: any) => {
    console.log(values);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    form.resetFields();
    onCancel && onCancel(e);
  };

  return (
    <Modal
      {...props}
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
            title="Gửi hồ sơ"
            className="basis-1/2"
            iconAfter={<Fly />}
            onClick={() => form.submit()}
          />
        </Flex>
      }
      onCancel={handleCancel}
    >
      <Space direction="vertical" size="large" className="w-full">
        <RadioGroup
          value={value}
          className="flex flex-col gap-5"
          onChange={(e) => setValue(e.target.value)}
        >
          <Radio value={1}>Chọn từ CV đã có</Radio>
          <Radio value={2}>Tải lên CV mới</Radio>
        </RadioGroup>
        <FormWrapper form={form} onFinish={handleFinish}>
          <FormItem
            name="cv"
            className="mb-0"
            label={value === 1 ? 'Chọn CV ứng tuyển' : 'Hồ sơ xin việc / CV'}
            rules={[{ required: true, message: 'Vui lòng chọn CV' }]}
          >
            {value === 1 ? <Select placeholder="Chọn CV" /> : <Dragger />}
          </FormItem>
        </FormWrapper>
      </Space>
    </Modal>
  );
};

export default JobApplyModal;
