import { ConfigProvider, Upload, UploadProps } from 'antd';
import classNames from 'classnames';
import { ReactNode } from 'react';
import icons from '~/utils/icons';

export interface IUploadProps extends UploadProps {
  icon?: ReactNode;
  title?: ReactNode;
  hint?: ReactNode;
}

const { CloudUploadOutlined } = icons;
const { Dragger: DraggerAntd } = Upload;

const Dragger = ({
  icon,
  hint,
  title,
  children,
  className,
  ...props
}: IUploadProps) => {
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
        {children || (
          <>
            {icon || (
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
            )}
            {title || (
              <p className="ant-upload-text">
                Nhấn vào hoặc kéo thả tệp tin để tải lên
              </p>
            )}
            {hint || (
              <p className="ant-upload-hint">Hỗ trợ tệp tin: PDF, DOC, DOCX</p>
            )}
          </>
        )}
      </DraggerAntd>
    </ConfigProvider>
  );
};

export default Dragger;
