import { Modal, Typography } from 'antd';
import Button from '~/components/Button/Button';
const { Text, Paragraph } = Typography;

interface RecoverJobModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const RecoverJobModal: React.FC<RecoverJobModalProps> = ({
  open,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Khôi phục tin tuyển dụng"
      footer={null}
    >
      <Paragraph className="flex flex-col">
        <Text className="text-green-600">
          - Bạn muốn khôi phục tin tuyển dụng này?
        </Text>
      </Paragraph>
      <div className="flex items-center justify-center gap-2">
        <Button title="Hủy" onClick={onCancel} className="w-full" />
        <Button title="Khôi phục" fill className="w-full" onClick={onConfirm} />
      </div>
    </Modal>
  );
};

export default RecoverJobModal;
