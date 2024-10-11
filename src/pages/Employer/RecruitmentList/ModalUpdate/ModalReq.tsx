import { Form, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useState } from 'react';
import Editor from '~/components/Editor/Editor';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  initContent: string;
  onUpdate: (value: string) => void;
}

const ModalReq: React.FC<ModalProps> = ({
  open,
  onClose,
  initContent,
  onUpdate,
}) => {
  const [form] = useForm();
  const [editorContent, setEditorContent] = useState(initContent);

  useEffect(() => {
    setEditorContent(initContent);
    form.setFieldValue('requirements', initContent);
  }, [initContent, 'requirements', form]);

  const handleEditorChange = (newValue: string) => {
    setEditorContent(newValue);
    form.setFieldValue('requirements', newValue);
  };

  const handleOk = () => {
    onUpdate(editorContent);
  };

  return (
    <Modal
      title={<p className="text-center border-b pb-2">Cập nhật thông tin </p>}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
    >
      <Form.Item name="requirements" label="Yêu cầu công việc">
        <Editor
          initialValue={initContent}
          value={editorContent}
          onEditorChange={handleEditorChange}
        />
      </Form.Item>
    </Modal>
  );
};

export default ModalReq;
