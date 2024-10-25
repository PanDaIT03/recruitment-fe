import { ConfigProvider, Upload, UploadProps } from 'antd';
import classNames from 'classnames';
import icons from '~/utils/icons';

const { CloudUploadOutlined } = icons;
const { Dragger: DraggerAntd } = Upload;

const Dragger = ({ children, className, ...props }: UploadProps) => {
  const customeClass = classNames('w-full', className);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimaryHover: '#f15224',
        },
      }}
    >
      <DraggerAntd className={customeClass} {...props}>
        {children ? (
          children
        ) : (
          <>
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined />
            </p>
            <p className="ant-upload-text">
              Nhấn vào hoặc kéo thả tệp tin để tải lên
            </p>
            <p className="ant-upload-hint">Hỗ trợ tệp tin: PDF, DOC, DOCX</p>
          </>
        )}
      </DraggerAntd>
    </ConfigProvider>
  );
};

export default Dragger;
