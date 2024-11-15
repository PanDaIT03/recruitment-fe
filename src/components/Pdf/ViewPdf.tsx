import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Spin } from 'antd';

interface PDFViewerProps {
  fileUrl?: string;
  fileName?: string;
}

const PDFViewer = ({ fileUrl }: PDFViewerProps) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // const handleDownloadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();

  //   if (fileUrl) {
  //     fetch(fileUrl)
  //       .then((response) => response.blob())
  //       .then((blob) => {
  //         const url = window.URL.createObjectURL(blob);
  //         const link = document.createElement('a');
  //         link.href = url;
  //         link.download = fileName;
  //         link.click();
  //         window.URL.revokeObjectURL(url);
  //       })
  //       .catch((error) => {
  //         console.error('Error downloading PDF:', error);
  //       });
  //   }
  // };

  if (!fileUrl) {
    return (
      <div className="text-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{ height: '100vh', border: '1px solid #ccc', borderRadius: '5px' }}
    >
      <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
        <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  );
};

export default PDFViewer;
