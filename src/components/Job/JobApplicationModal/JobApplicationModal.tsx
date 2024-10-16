import { message, Radio, Select, Upload, UploadFile, UploadProps } from 'antd';
import { useState } from 'react';
import { JobsAPI } from '~/apis/job';
import Button from '~/components/Button/Button';
import icons from '~/utils/icons';
import './JobApplicationModal.scss';
import { useFetch } from '~/hooks/useFetch';
import UserApi from '~/apis/user';

const { Option } = Select;
const { Dragger } = Upload;
const { CloudUploadOutlined } = icons;

type JobApplicationModalProps = {
  jobTitle: string;
  jobId: number;
  handleToggleModal: () => void;
};

const JobApplicationModal = ({
  jobTitle,
  handleToggleModal,
  jobId,
}: JobApplicationModalProps) => {
  const [cvOption, setCvOption] = useState('existing');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCvId, setSelectedCvId] = useState<number | null>(null);

  const { data: myCV } = useFetch<any>(UserApi.getMyCv);

  const handleUpload = async () => {
    const formData = new FormData();

    if (cvOption === 'new') {
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('file', file.originFileObj);
          formData.append('jobsId', jobId.toString());
        }
      });
      setUploading(true);
    } else if (cvOption === 'existing' && selectedCvId) {
      formData.append('jobsId', jobId.toString());
      formData.append('file', selectedCvId?.toString());
    }

    try {
      const response = await JobsAPI.ApplyJob(formData);

      setFileList([]);

      message.success(response?.message);
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setUploading(false);
    }
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const isValidFormat =
        file.type === 'application/pdf' ||
        file.type === 'application/msword' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

      if (!isValidFormat) {
        message.error('Tệp tin không hợp lệ! Chỉ hỗ trợ PDF, DOC, DOCX.');
      }

      setFileList([...fileList, { ...file, originFileObj: file }]);
      return false;
    },
    maxCount: 1,
  };

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
          <Select
            placeholder="Chọn CV"
            style={{ width: '100%' }}
            onChange={setSelectedCvId}
          >
            {myCV?.items?.map?.((cv: any) => (
              <Option value={cv.id} key={cv.id}>
                {cv.fileName.replace('.pdf', '')}
              </Option>
            ))}
          </Select>
        </div>
      )}

      {cvOption === 'new' && (
        <div className="mb-4">
          <p className="mb-2 font-medium">Tải lên CV mới</p>
          <Dragger {...props} maxCount={1}>
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
        <Button
          title="Gửi hồ sơ"
          fill
          onClick={handleUpload}
          loading={uploading}
          disabled={fileList.length === 0 && cvOption === 'new'}
        />
      </div>
    </div>
  );
};

export default JobApplicationModal;
