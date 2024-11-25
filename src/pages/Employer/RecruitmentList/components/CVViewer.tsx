import { Card } from 'antd';
import PDFViewer from '~/components/Pdf/ViewPdf';
import { MenuIcon } from '~/assets/svg';
import { ApplicationJobDetail } from '~/types/Job';

interface CVViewerProps {
  applicationJobs: ApplicationJobDetail | undefined;
}

const CVViewer = ({ applicationJobs }: CVViewerProps) => (
  <Card
    className="rounded-2xl"
    title={
      <div className="w-full flex items-center justify-center gap-2">
        <MenuIcon />
        <span>{applicationJobs?.curriculumVitae?.fileName}</span>
      </div>
    }
  >
    <PDFViewer
      fileUrl={applicationJobs?.curriculumVitae?.url}
      fileName={applicationJobs?.curriculumVitae?.fileName}
    />
  </Card>
);

export default CVViewer;
