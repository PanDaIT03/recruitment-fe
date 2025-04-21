import {
  CheckboxOptionType,
  Col,
  Flex,
  FormInstance,
  Row,
  Tabs,
  TabsProps,
} from 'antd';
import { memo, ReactElement, useEffect, useMemo, useState } from 'react';

import { DefaultOptionType } from 'antd/es/select';
import Button from '~/components/Button/Button';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import Modal, { IModalProps } from '~/components/Modal/Modal';
import { RadioGroup } from '~/components/Radio/Radio';
import icons from '~/utils/icons';
import { IFunctionalForm } from './FunctionalManagement';
import Dragger from '~/components/Dragger/Dragger';

interface IProps extends IModalProps {
  editIndex: number;
  form: FormInstance<IFunctionalForm>;
  onFinish(values: any): void;
}

type CustomTabItem = Omit<Required<TabsProps>['items'][number], 'children'> & {
  name: string;
  children: ReactElement;
};

const { CloseOutlined, SaveOutlined } = icons;

const ModalFunctional = ({
  form,
  isOpen,
  editIndex,
  loading,
  onCancel,
  onFinish,
}: IProps) => {
  const items: TabsProps['items'] = useMemo(
    () => [
      {
        key: '1',
        label: 'Link',
        children: (
          <FormItem
            name="icon"
            extra="Hỗ trợ các định dạng: .png, .jpg, .jpeg, .gif, .svg"
            rules={[{ required: true, message: 'Vui lòng nhập đường dẫn' }]}
          >
            <Input
              allowClear
              placeholder="Ví dụ: https://example.com/icon.png"
            />
          </FormItem>
        ),
      },
      {
        key: '2',
        label: 'File',
        children: (
          <FormItem
            name="icon"
            rules={[{ required: true, message: 'Vui lòng tải lên tệp' }]}
          >
            <Dragger />
          </FormItem>
        ),
      },
      {
        key: '3',
        label: 'Text',
        children: (
          <FormItem
            name="icon"
            extra="Hỗ trợ các icon từ Antd"
            rules={[{ required: true, message: 'Vui lòng nhập icon' }]}
          >
            <Input allowClear placeholder="Ví dụ: AppstoreOutlined" />
          </FormItem>
        ),
      },
    ],
    []
  );

  return (
    <Modal
      isOpen={isOpen}
      className="min-w-[60%]"
      title={editIndex ? 'Chỉnh sửa chức năng' : 'Thêm chức năng'}
      footer={
        <Flex justify="end" gap={16}>
          <Button
            title="Hủy"
            loading={loading}
            iconBefore={<CloseOutlined />}
            onClick={onCancel}
          />
          <Button
            fill
            title="Lưu"
            loading={loading}
            iconBefore={<SaveOutlined />}
            onClick={() => form.submit()}
          />
        </Flex>
      }
      onCancel={onCancel}
    >
      <FormWrapper footer={<></>} form={form} onFinish={onFinish}>
        <FormItem
          name="code"
          label="Mã"
          rules={[{ required: true, message: 'Vui lòng nhập mã' }]}
        >
          <Input allowClear placeholder="Ví dụ: Tạo công việc ứng tuyển" />
        </FormItem>
        <FormItem
          name="title"
          label="Tên chức năng"
          rules={[{ required: true, message: 'Vui lòng nhập chức năng' }]}
        >
          <Input allowClear placeholder="Ví dụ: create_new_job	" />
        </FormItem>
        <Row gutter={[6, 18]}>
          <Col span={6}>
            <FormItem
              name="orderIndex"
              label="Thứ tự hiển thị"
              rules={[{ required: true, message: 'Vui lòng nhập thứ tự' }]}
            >
              <Input type="number" placeholder="Ví dụ: 1" />
            </FormItem>
          </Col>
          <Col span={18}>
            <FormItem
              name="path"
              label="Đường dẫn"
              rules={[{ required: true, message: 'Vui lòng nhập đường dẫn' }]}
            >
              <Input allowClear placeholder="Ví dụ: /user/profile" />
            </FormItem>
          </Col>
        </Row>
        <FormItem label="Icon">
          <Tabs items={items} />
        </FormItem>
      </FormWrapper>
    </Modal>
  );
};

export default memo(ModalFunctional);
