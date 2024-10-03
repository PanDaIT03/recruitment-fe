import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { memo } from 'react';

import FormItem from '~/components/Form/FormItem';
import ProfileModal from './ProfileModal';

interface IProps {
  isOpen: boolean;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

const AchievementModal = ({ isOpen, setSelectedItem }: IProps) => {
  const [form] = useForm();

  const handleFinish = (values: any) => {
    console.log(values);
  };

  const handleCancel = () => {
    setSelectedItem('');
  };

  return (
    <ProfileModal
      form={form}
      isOpen={isOpen}
      title="Cập nhật tóm tắt"
      onCancel={handleCancel}
      onFinish={handleFinish}
    >
      <FormItem
        name="achievement"
        rules={[{ required: true, message: 'Hãy điền vào tóm tắt của bạn' }]}
        label={
          <p className="text-sm font-medium">
            Tóm tắt 3-5 thành tựu hoặc lý do nổi bật khiến nhà tuyển dụng chọn
            bạn?
          </p>
        }
      >
        <TextArea
          placeholder={`Ví dụ:
- Tốt nghiệp loại giỏi chuyên ngành Quản trị Nhân lực với GPA 3.53/4.00 
- Đạt 100% KPI trong thời gian thử việc, vượt 119% KPI chung trong Quý 2 2022 
- Mang về mỗi tháng lên tới 30 khách hàng tương đương 40% doanh thu năm 2023`}
          className="p-3 rounded-lg !min-h-48"
        />
      </FormItem>
    </ProfileModal>
  );
};

export default memo(AchievementModal);
