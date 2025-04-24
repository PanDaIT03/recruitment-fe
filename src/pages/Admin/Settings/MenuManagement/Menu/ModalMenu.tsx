import {
  Col,
  FormInstance,
  message,
  Row,
  Tabs,
  TabsProps,
  Upload,
  UploadFile,
} from 'antd';
import { memo, useCallback, useMemo, useState } from 'react';
import Dragger, { IUploadProps } from '~/components/Dragger/Dragger';

import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import Modal, { IModalProps } from '~/components/Modal/Modal';
import { IMenuForm } from './Menu';

interface IProps extends IModalProps {
  form: FormInstance<IMenuForm>;
  onFinish: (values: any) => void;
}

enum TAB_KEY {
  TEXT = 'text',
  FILE = 'file',
}

const ModalMenu = ({ form, onFinish, ...props }: IProps) => {
  const [activeKey, setActiveKey] = useState('');
  const [uploadFile, setUploadFile] = useState<UploadFile[]>([]);

  const draggerProps: IUploadProps = useMemo(
    () => ({
      name: 'file',
      maxCount: 1,
      fileList: uploadFile,
      hint: 'Hỗ trợ tệp tin: PNG, JPG, JPEG, SVG',
      onRemove: () => setUploadFile([]),
      beforeUpload: (file) => {
        const isValidFormat =
          file.type === 'image/png' ||
          file.type === 'image/jpeg' ||
          file.type === 'image/jpg' ||
          file.type === 'image/svg+xml';

        if (!isValidFormat) {
          message.error(
            'Tệp tin không hợp lệ! Chỉ hỗ trợ PNG, JPG, JPEG, SVG.'
          );
          return Upload.LIST_IGNORE;
        }

        const newFile: UploadFile[] = [
          ...uploadFile,
          { uid: file.uid, name: file.name, originFileObj: file },
        ];

        setUploadFile(newFile);
        return false;
      },
    }),
    [uploadFile]
  );

  const tabItems: TabsProps['items'] = useMemo(
    () => [
      {
        key: TAB_KEY.TEXT,
        label: 'Text/Link',
        children: (
          <FormItem
            label="Icon path"
            name="iconPath"
            rules={[
              {
                required: activeKey === TAB_KEY.TEXT,
                message: 'Vui lòng nhập đường dẫn cho icon',
              },
            ]}
            extra="Nhập tên icon builtin (home, user, settings, chart) hoặc URL đến icon (https://example.com/icon.svg)"
          >
            <Input allowClear placeholder="Nhập tên icon hoặc URL hình ảnh" />
          </FormItem>
        ),
      },
      {
        key: TAB_KEY.FILE,
        label: 'File',
        children: (
          <FormItem
            label="Icon path"
            name="iconFile"
            rules={[
              {
                required: activeKey === TAB_KEY.FILE,
                message: 'Vui lòng tải lên tệp icon',
              },
            ]}
          >
            <Dragger {...draggerProps} />
          </FormItem>
        ),
      },
    ],
    [activeKey, draggerProps]
  );

  const handleTabChange = useCallback((activeKey: string) => {
    console.log(activeKey);
    setActiveKey(activeKey);
  }, []);

  return (
    <Modal {...props} onOk={() => form.submit()}>
      <FormWrapper form={form} onFinish={onFinish}>
        <Row gutter={[8, 16]}>
          <Col span={9}>
            <FormItem
              label="Order"
              name="orderIndex"
              rules={[{ required: true, message: 'Vui lòng nhập thứ tự' }]}
            >
              <Input type="number" />
            </FormItem>
          </Col>
          <Col span={15}>
            <FormItem
              label="Tên menu"
              name="title"
              rules={[{ required: true, message: 'Vui lòng nhập tên menu' }]}
            >
              <Input />
            </FormItem>
          </Col>
        </Row>
        <FormItem
          label="Path"
          name="path"
          rules={[{ required: true, message: 'Vui lòng nhập đường dẫn' }]}
        >
          <Input />
        </FormItem>
        <Tabs items={tabItems} onChange={handleTabChange} />
      </FormWrapper>
    </Modal>
  );
};

export default memo(ModalMenu);
