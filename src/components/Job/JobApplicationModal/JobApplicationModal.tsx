import { Radio, Select, UploadProps } from 'antd';
import { useState } from 'react';
import './JobApplicationModal.scss';
import Button from '~/components/Button/Button';
import { message, Upload } from 'antd';
import icons from '~/utils/icons';

const { Dragger } = Upload;

const { CloudUploadOutlined } = icons;

type JobApplicationModalProps = {
  jobTitle: string;
  handleToggleModal: () => void;
};

const props: UploadProps = {
  name: 'file',
  multiple: true,
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const JobApplicationModal = ({
  jobTitle,
  handleToggleModal,
}: JobApplicationModalProps) => {
  const [cvOption, setCvOption] = useState('existing');

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4">
        Ứng tuyển vị trí: <span className="text-orange-500">{jobTitle}</span>
      </h2>

      <div className="mb-4">
        <Radio.Group
          onChange={(e) => setCvOption(e.target.value)}
          value={cvOption}
        >
          <Radio value="existing" className="flex items-center mb-2">
            <span className="ml-2">Chọn từ CV đã có</span>
          </Radio>
          <Radio value="new" className="flex items-center">
            <span className="ml-2">Tải lên CV mới</span>
          </Radio>
        </Radio.Group>
      </div>

      {cvOption === 'existing' && (
        <div className="mb-4">
          <p className="mb-2 font-medium">Chọn CV ứng tuyển</p>
          <Select placeholder="Chọn CV" style={{ width: '100%' }}></Select>
        </div>
      )}

      {cvOption === 'new' && (
        <div className="mb-4">
          <p className="mb-2 font-medium">Tải lên CV mới</p>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined style={{ color: '#f97316' }} />
            </p>
            <p className="ant-upload-text">
              Nhấn hoặc kéo thả tệp tin để tải lên
            </p>
            <p className="ant-upload-hint">Hỗ trợ tệp tin: PDF, DOC, DOCX</p>
          </Dragger>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-end mt-6 gap-2">
        <Button title="Để sau" onClick={handleToggleModal} />
        <Button title="Gửi hồ sơ" fill onClick={handleToggleModal} />
      </div>
    </div>
  );
};

export default JobApplicationModal;
