import GenericModal from './GenricModal';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  initContent: string;
  onUpdate: (value: string) => void;
}

const ModalReq: React.FC<ModalProps> = (props) => {
  return (
    <GenericModal
      {...props}
      title="Cập nhật thông tin"
      fieldName="requirements"
      fieldLabel="Yêu cầu công việc"
    />
  );
};

export default ModalReq;
