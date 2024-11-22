import { Modal, Typography } from 'antd';
import Button from '~/components/Button/Button';
const { Text, Paragraph } = Typography;

interface DeleteJobModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteJobModal: React.FC<DeleteJobModalProps> = ({
  open,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Xoá tin tuyển dụng"
      footer={null}
    >
      <Paragraph className="flex flex-col">
        <Text className="text-orange-600">
          - Tin đã xóa có thể khôi phục lại trong vòng 30 ngày.
        </Text>
        <Text>- Tin đã xóa không thể khôi phục lại.</Text>
        <Text>
          - Tất cả ứng viên đang ứng tuyển vào tin này sẽ bị hủy ứng tuyển.
        </Text>
      </Paragraph>
      <div className="flex items-center justify-center gap-2">
        <Button title="Hủy" onClick={onCancel} className="w-full" />
        <Button title="Xác nhận" fill className="w-full" onClick={onConfirm} />
      </div>
    </Modal>
  );
};

export default DeleteJobModal;
