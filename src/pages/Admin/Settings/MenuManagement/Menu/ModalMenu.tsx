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
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import Dragger, { IUploadProps } from '~/components/Dragger/Dragger';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import Modal, { IModalProps } from '~/components/Modal/Modal';
import Select from '~/components/Select/Select';
import { ICON_TYPE } from '~/enums';
import { useAppSelector } from '~/hooks/useStore';
import { IMenuForm } from './Menu';

interface IProps extends IModalProps {
  form: FormInstance<IMenuForm>;
  onFinish: (values: any) => void;
}

const ModalMenu = ({ isOpen, form, onFinish, ...props }: IProps) => {
  const [activeKey, setActiveKey] = useState(ICON_TYPE.BUILT_IN);
  const [uploadFile, setUploadFile] = useState<UploadFile[]>([]);

  const { functionals, loading } = useAppSelector((state) => state.functional);

  useEffect(() => {
    if (!isOpen) return;

    if (uploadFile?.length) setUploadFile([]);

    const activeKey = form.getFieldValue('iconType');
    setActiveKey(activeKey);
  }, [isOpen]);

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
        key: ICON_TYPE.BUILT_IN,
        label: 'Text/Link',
        children: (
          <FormItem
            label="Icon path"
            name="iconPath"
            extra="Nhập tên icon builtin (home, user, settings, chart) hoặc URL đến icon (https://example.com/icon.svg)"
          >
            <Input allowClear placeholder="Nhập tên icon hoặc URL hình ảnh" />
          </FormItem>
        ),
      },
      {
        key: ICON_TYPE.IMAGE,
        label: 'File',
        children: (
          <FormItem label="Icon path" name="iconFile">
            <Dragger {...draggerProps} />
          </FormItem>
        ),
      },
    ],
    [draggerProps]
  );

  const handleChangeTab = useCallback((activeKey: string) => {
    form.setFieldValue('iconType', activeKey);
    setActiveKey(activeKey as ICON_TYPE);
  }, []);

  return (
    <Modal {...props} isOpen={isOpen} onOk={() => form.submit()}>
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
              label="Tên menu"
              name="title"
              rules={[{ required: true, message: 'Vui lòng nhập tên menu' }]}
            >
              <Input allowClear placeholder="Ví dụ: Tài khoản" />
            </FormItem>
          </Col>
        </Row>
        <FormItem
          label="Chức năng"
          name="functionalIds"
          rules={[{ required: true, message: 'Vui lòng chọn chức năng' }]}
        >
          <Select
            allowClear
            mode="multiple"
            loading={loading}
            placeholder="Chọn chức năng"
            options={functionals?.items?.map((functional) => ({
              label: functional?.title,
              value: functional?.id,
            }))}
          />
        </FormItem>
        <FormItem
          label="Path"
          name="path"
          rules={[{ required: true, message: 'Vui lòng nhập đường dẫn' }]}
        >
          <Input allowClear placeholder="Ví dụ: /user-account" />
        </FormItem>
        <Tabs
          items={tabItems}
          activeKey={activeKey}
          defaultActiveKey={ICON_TYPE.BUILT_IN}
          onChange={handleChangeTab}
        />
      </FormWrapper>
    </Modal>
  );
};

export default memo(ModalMenu);
