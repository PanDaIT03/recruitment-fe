import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { memo } from 'react';

import FormItem from '~/components/Form/FormItem';
import ProfileModal from './ProfileModal';
import { Editor } from '@tinymce/tinymce-react';

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
        <Editor
          apiKey={import.meta.env.VITE_APP_TINYMCE_API_KEY}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              'lists',
              'link',
              'image',
              'charmap',
              'preview',
              'anchor',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'wordcount',
            ],
            toolbar:
              'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
          }}
        />
      </FormItem>
    </ProfileModal>
  );
};

export default memo(AchievementModal);
