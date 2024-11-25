import { memo, ReactNode } from 'react';

import icons from '~/utils/icons';
import ButtonAction from './ButtonAction';

interface IProps {
  url: string;
  fileName: string;
  title?: ReactNode;
}

const { DownloadOutlined } = icons;

const DownloadButton = ({ url, title, fileName }: IProps) => {
  const handleDownLoad = async () => {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'downloaded_file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(fileUrl);
  };

  return (
    <ButtonAction
      title={title || <DownloadOutlined className="text-[#691f74]" />}
      onClick={handleDownLoad}
    />
  );
};

export default memo(DownloadButton);
