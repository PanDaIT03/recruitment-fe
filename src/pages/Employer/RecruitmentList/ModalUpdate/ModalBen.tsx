import GenericModal from './GenricModal';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  initContent: string;
  onUpdate: (value: string) => void;
}

const ModalBen: React.FC<ModalProps> = (props) => {
  return (
    <GenericModal
      {...props}
      title="Cập nhật thông tin"
      fieldName="benefits"
      fieldLabel="Phúc lợi"
    />
  );
};

export default ModalBen;
