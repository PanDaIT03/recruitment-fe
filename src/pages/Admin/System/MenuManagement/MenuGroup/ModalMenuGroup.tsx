import { Col, FormInstance, Row } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { memo } from 'react';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import Modal, { IModalProps } from '~/components/Modal/Modal';
import Select from '~/components/Select/Select';
import { useAppSelector } from '~/hooks/useStore';

interface IProps extends IModalProps {
  form: FormInstance<any>;
  onFinish: (values: any) => void;
}

const ModalMenuGroup = ({ form, onFinish, ...props }: IProps) => {
  const { menuViews, loading } = useAppSelector((state) => state.menuView);

  return (
    <Modal {...props} cancelText="Hủy" onOk={() => form.submit()}>
      <FormWrapper form={form} onFinish={onFinish}>
        <Row gutter={[8, 16]}>
          <Col span={9}>
            <FormItem
              label="Order"
              name="orderIndex"
              rules={[{ required: true, message: 'Vui lòng nhập thứ tự' }]}
            >
              <Input type="number" placeholder="Ví dụ: 1" />
            </FormItem>
          </Col>
          <Col span={15}>
            <FormItem
              label="Tên nhóm menu"
              name="title"
              rules={[{ required: true, message: 'Vui lòng nhập tên menu' }]}
            >
              <Input allowClear placeholder="Ví dụ: Người tìm việc" />
            </FormItem>
          </Col>
        </Row>
        <FormItem
          label="Menu"
          name="menuViewIds"
          rules={[{ required: true, message: 'Vui lòng chọn menu' }]}
        >
          <Select
            allowClear
            mode="multiple"
            loading={loading}
            placeholder="Chọn menu"
            options={menuViews?.items?.map((menuView) => ({
              label: menuView?.title,
              value: menuView?.id,
            }))}
          />
        </FormItem>
        <FormItem
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <TextArea
            allowClear
            className="bg-[#fafafa] min-h-32"
            placeholder="Ví dụ: Nhóm chức năng..."
          />
        </FormItem>
      </FormWrapper>
    </Modal>
  );
};

export default memo(ModalMenuGroup);
