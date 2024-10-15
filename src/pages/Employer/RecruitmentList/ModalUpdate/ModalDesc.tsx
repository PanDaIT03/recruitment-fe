import GenericModal from './GenricModal';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  initContent: string;
  onUpdate: (value: string) => void;
}

const ModalDesc: React.FC<ModalProps> = (props) => {
  return (
    <GenericModal
      {...props}
      title="Cập nhật thông tin"
      fieldName="description"
      fieldLabel="Mô tả công việc"
    />
  );
};

export default ModalDesc;
