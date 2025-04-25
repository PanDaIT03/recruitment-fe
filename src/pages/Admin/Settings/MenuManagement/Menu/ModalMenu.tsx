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
import { memo, useEffect, useMemo, useState } from 'react';
import Dragger, { IUploadProps } from '~/components/Dragger/Dragger';

import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import Modal, { IModalProps } from '~/components/Modal/Modal';
import Select from '~/components/Select/Select';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getAllFunctionals } from '~/store/thunk/functional';
import { IMenuForm } from './Menu';

interface IProps extends IModalProps {
  form: FormInstance<IMenuForm>;
  onFinish: (values: any) => void;
}

enum TAB_KEY {
  TEXT = 'text',
  FILE = 'file',
}

const ModalMenu = ({ isOpen, form, onFinish, ...props }: IProps) => {
  const dispatch = useAppDispatch();

  const [uploadFile, setUploadFile] = useState<UploadFile[]>([]);
  const { functionals } = useAppSelector((state) => state.functional);

  useEffect(() => {
    if (!!functionals?.items?.length) return;
    dispatch(getAllFunctionals({ type: 'combobox' }));
  }, [functionals]);

  useEffect(() => {
    if (isOpen && uploadFile?.length) setUploadFile([]);
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
        key: TAB_KEY.TEXT,
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
        key: TAB_KEY.FILE,
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
          label="Chức năng"
          name="functionalIds"
          rules={[{ required: true, message: 'Vui lòng chọn chức năng' }]}
        >
          <Select
            mode="multiple"
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
          <Input />
        </FormItem>
        <Tabs defaultActiveKey={TAB_KEY.TEXT} items={tabItems} />
      </FormWrapper>
    </Modal>
  );
};

export default memo(ModalMenu);
