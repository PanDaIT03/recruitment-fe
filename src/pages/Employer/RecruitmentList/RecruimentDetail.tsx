import { Avatar, Badge, Button, Card, Divider, Flex } from 'antd';
import { useLocation } from 'react-router-dom';
import { JobsAPI } from '~/apis/job';
import { MenuIcon } from '~/assets/svg';
import PDFViewer from '~/components/Pdf/ViewPdf';
import { useFetch } from '~/hooks/useFetch';
import icons from '~/utils/icons';

const { PlusOutlined, EditOutlined, CalendarOutlined } = icons;

const RecruimentDetail = () => {
  const location = useLocation();
  const data = location.state;

  const { data: applicationJobs } = useFetch<any>(
    ['getApplicantsDetail', data.usersId, data.jobsId],
    () => JobsAPI.getApplicantsDetail(data[0].usersId, data[0].jobsId)
  );

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Card bordered={false} className="shadow-sm rounded-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar size={40} className="bg-gray-200" />
                <div>
                  <h2 className="text-lg font-medium">T</h2>
                  <p className="text-gray-500">T</p>
                  <Button
                    type="text"
                    className="text-orange-500 px-0 flex items-center"
                    icon={<PlusOutlined className="text-orange-500" />}
                  >
                    Gắn hashtag
                  </Button>
                </div>
              </div>
            </div>
            <Divider className="w-full" />
            <div className="flex items-center justify-between">
              <p className="text-sub">Vị trí</p>
              <p>Kế toán</p>
            </div>
            <div className="flex items-center justify-between my-2">
              <p className="text-sub">Trạng thái</p>
              <p>
                <Badge color="blue" />
                <span className="text-blue mx-2">Đang đánh giá</span>
                <span>
                  <EditOutlined className="cursor-pointer" />
                </span>
              </p>
            </div>
            <div className="flex items-center justify-between my-2">
              <p className="text-sub">Ngày ứng tuyển</p>
              <p>
                13/11/2024 <br />
                <span className="text-xs text-sub">1 ngày trước</span>
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sub">Cập nhật</p>
              <p>một ngày trước</p>
            </div>
          </Card>

          <Card
            className="shadow-sm rounded-2xl mt-4"
            title={
              <div className="flex items-center space-x-2">
                <CalendarOutlined />
                <span>Lịch phỏng vấn</span>
              </div>
            }
            extra={
              <Button
                type="text"
                className="text-orange-500"
                icon={<PlusOutlined className="text-orange-500" />}
              >
                Thêm
              </Button>
            }
          >
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <p className="text-gray-400 mb-4">Chưa có lịch phỏng vấn nào</p>
              <Button
                type="text"
                className="text-orange-500"
                icon={<PlusOutlined className="text-orange-500" />}
              >
                Thêm lịch phỏng vấn
              </Button>
            </div>
          </Card>
        </div>
        <div className="col-span-2 w-full h-full">
          <Card
            className="rounded-2xl"
            title={
              <>
                <div className="w-full flex items-center justify-center gap-2">
                  <span>
                    <MenuIcon />
                  </span>
                  <span>{applicationJobs?.curriculumVitae?.fileName}</span>
                </div>
              </>
            }
          >
            <PDFViewer
              fileUrl={applicationJobs?.curriculumVitae?.url}
              fileName={applicationJobs?.curriculumVitae?.fileName}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecruimentDetail;
