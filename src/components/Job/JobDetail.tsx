import {
  AppstoreOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  EnvironmentOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  LaptopOutlined,
  ShareAltOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Card, Col, Divider, Row } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getJobById } from '~/store/thunk/job';
import Button from '../Button/Button';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const rightColRef = useRef<HTMLDivElement>(null);
  const { currentJob } = useAppSelector((state) => state.jobs);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getJobById(id));
  }, [id]);
  console.log(currentJob);

  useEffect(() => {
    const handleScroll = () => {
      if (rightColRef.current) {
        const rect = rightColRef.current.getBoundingClientRect();
        const parentRect =
          rightColRef.current.parentElement?.getBoundingClientRect();

        if (parentRect) {
          if (window.scrollY > parentRect.top) {
            rightColRef.current.style.position = 'fixed';
            rightColRef.current.style.top = '20px';
            rightColRef.current.style.width = `${parentRect.width}px`;
          } else {
            rightColRef.current.style.position = 'static';
            rightColRef.current.style.width = '100%';
          }

          if (window.scrollY + rect.height > parentRect.bottom) {
            const diff = window.scrollY + rect.height - parentRect.bottom;
            rightColRef.current.style.top = `${20 - diff}px`;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Row gutter={[16, 16]} className="flex flex-col md:flex-row">
        <Col xs={24} md={16} className="mb-4 md:mb-0">
          <Button
            className="w-full md:hidden mb-4"
            type="button"
            iconBefore={<TeamOutlined />}
            title="Ứng tuyển ngay"
          />
          <div className="mb-4 hidden md:block">
            <h1 className="text-2xl font-bold mb-2">
              Nhân viên tư vấn Giáo dục (Educational Consultant)
            </h1>
            <p className="text-gray-500 mb-4">Cty TNHH Anh Ngữ Ytelcom</p>
            <div className="flex flex-wrap gap-2">
              <Button
                iconBefore={<ShareAltOutlined />}
                type="button"
                className="mb-2 sm:mb-0"
                title="Chia sẻ"
              />

              <Button
                fill
                type="button"
                className="w-full sm:w-auto"
                title="Ứng tuyển ngay"
              />
            </div>
          </div>
          <Card className="shadow-md">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">
              Chi tiết tin tuyển dụng
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 bg-purple-100 rounded-md p-4">
              <div className="flex items-center">
                <EnvironmentOutlined className="text-2xl mr-2 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Địa điểm</p>
                  <p className="font-medium">Hà Nội</p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarCircleOutlined className="text-2xl mr-2 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Mức lương</p>
                  <p className="font-medium">10tr - 15tr VND</p>
                </div>
              </div>
              <div className="flex items-center">
                <LaptopOutlined className="text-2xl mr-2 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Hình thức làm việc</p>
                  <p className="font-medium">Tại văn phòng</p>
                </div>
              </div>
              <div className="flex items-center">
                <ClockCircleOutlined className="text-2xl mr-2 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Loại công việc</p>
                  <p className="font-medium">Toàn thời gian</p>
                </div>
              </div>
              <div className="flex items-center">
                <AppstoreOutlined className="text-2xl mr-2 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Lĩnh vực</p>
                  <p className="font-medium">Thiết kế</p>
                </div>
              </div>
              <div className="flex items-center">
                <TeamOutlined className="text-2xl mr-2 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Số lượng</p>
                  <p className="font-medium">01 ứng viên</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
              <InfoCircleOutlined className="text-blue-500 mr-2" />
              <span className="text-blue-700">
                Tin tuyển dụng này đang nhận hồ sơ ứng tuyển...
              </span>
            </div>
            <Divider />

            <section className="mb-6">
              <h2 className="text-xl font-bold mb-2">Mô tả công việc</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Nhận được tin nhắn từ học viên qua chat box của công ty, sau
                  đó liên hệ tư vấn, giải đáp thông tin, chăm sóc khách hàng
                  tiềm năng trên các nền tảng phổ biến của công ty.
                </li>
                <li>
                  Tư vấn khóa học phù hợp cho học viên dựa trên nhu cầu và trình
                  độ của từng người.
                </li>
                <li>
                  Chủ động liên hệ và hỗ trợ học viên trong quá trình học tập.
                </li>
              </ul>
            </section>

            <Divider />

            <section className="mb-6">
              <h2 className="text-xl font-bold mb-2">Yêu cầu công việc</h2>
              {['Chuyên môn, kinh nghiệm:', 'Kỹ năng:', 'Ưu tiên:'].map(
                (title, index) => (
                  <div key={index}>
                    <h3 className="font-bold mt-4 mb-2">{`${index + 1}) ${title}`}</h3>
                    <ul className="list-disc pl-5 space-y-2"></ul>
                  </div>
                )
              )}
            </section>

            <Divider />

            <section>
              <h2 className="text-xl font-bold mb-2">
                Tại sao bạn nên thích làm việc tại đây
              </h2>
              <ul className="list-disc pl-5 space-y-2"></ul>
            </section>
          </Card>
        </Col>

        <Button
          className="w-full md:hidden"
          type="button"
          iconBefore={<TeamOutlined />}
          title="Ứng tuyển ngay"
        />
        <Col xs={24} md={8} className="hidden md:block">
          <Card
            className="shadow-md transition-all duration-300 ease-in-out"
            ref={rightColRef}
          >
            <h2 className="text-lg font-semibold mb-4">Được đăng bởi</h2>

            <div className="flex items-center mb-4">
              <div className="bg-gray-200 p-2 rounded-lg mr-3">
                <TeamOutlined className="text-2xl text-gray-500" />
              </div>
              <div>
                <p className="font-medium">Cty TNHH Anh Ngữ Vietop</p>
                <p className="text-orange-500">Chưa được xác minh</p>
              </div>
            </div>

            <Divider />
            <div className="space-y-2 mb-4">
              {[
                { label: 'Tên công ty :', value: 'Cty TNHH Anh Ngữ Vietop' },
                {
                  label: 'Tình trạng xác minh : ',
                  value: 'Chưa được xác minh',
                  className: 'text-orange-500',
                },
                { label: 'Lĩnh vực:', value: 'Giáo dục' },
                {
                  label: 'Website:',
                  value: (
                    <a
                      href="https://www.ieltsvietop.vn/tuyen-dung/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center"
                    >
                      ieltsvietop.vn/tuyen-dung
                      <ExportOutlined className="ml-1" />
                    </a>
                  ),
                },
              ].map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-500">{item.label}</span>
                  <span className={item.className}>{item.value}</span>
                </div>
              ))}
            </div>

            <Button
              className="w-full"
              type="button"
              iconBefore={<TeamOutlined />}
              title="Xem thông tin liên hệ"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default JobDetail;
