import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Button from '~/components/Button/Button';
import Editor from '~/components/Editor/Editor';

export interface GenericModalProps {
  open: boolean;
  onClose: () => void;
  initContent: string;
  onUpdate: (value: string) => void;
  title: string;
  fieldName: string;
  fieldLabel: string;
}

const GenericModal: React.FC<GenericModalProps> = ({
  open,
  onClose,
  initContent,
  onUpdate,
  title,
  fieldName,
  fieldLabel,
}) => {
  const [form] = useForm();
  const [editorContent, setEditorContent] = useState(initContent);

  useEffect(() => {
    setEditorContent(initContent);
    form.setFieldValue(fieldName, initContent);
  }, [initContent, fieldName, form]);

  const handleEditorChange = (newValue: string) => {
    setEditorContent(newValue);
    form.setFieldValue(fieldName, newValue);
  };

  const handleOk = () => {
    onUpdate(editorContent);
  };

  return (
    <Modal
      title={<p className="text-center border-b pb-2">{title}</p>}
      open={open}
      footer={false}
      closeIcon={null}
    >
      <Form.Item name={fieldName} label={fieldLabel}>
        <Editor
          initialValue={initContent}
          value={editorContent}
          onEditorChange={handleEditorChange}
        />
      </Form.Item>
      <div className="flex items-center justify-end gap-2">
        <Button title="Hủy" onClick={onClose} />
        <Button title="Cập nhật" onClick={handleOk} fill />
      </div>
    </Modal>
  );
};

export default GenericModal;
