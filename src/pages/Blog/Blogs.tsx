import { Avatar, Card, Tag } from 'antd';
import React from 'react';
import useBreadcrumb from '~/hooks/useBreadcrumb';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const {
  UserOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  CommentOutlined,
  LikeOutlined,
} = icons;

interface BlogPostProps {
  title: string;
  content: string;
  author: string;
  date: string;
  image: string;
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  content,
  author,
  date,
  image,
}) => {
  return (
    <Card className="mb-8 shadow-md">
      <img src={image} alt={title} className="w-full h-48 object-cover mb-4" />
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="mb-4">{content}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar icon={<UserOutlined />} className="mr-2" />
          <span className="mr-4 text-sm">{author}</span>
          <ClockCircleOutlined className="mr-1" />
          <span className="text-sm text-gray-500">{date}</span>
        </div>
        <div>
          <Tag color="blue" className="mr-1">
            <EyeOutlined /> 5 phút đọc
          </Tag>
          <Tag color="green">
            <CommentOutlined /> Phát triển bản thân
          </Tag>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <Tag color="blue">
          <LikeOutlined /> Thích
        </Tag>
        <Tag color="cyan">
          <CommentOutlined /> Bình luận
        </Tag>
        <Tag color="magenta">
          <EyeOutlined /> Xem thêm
        </Tag>
      </div>
    </Card>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className="w-full md:w-1/3 mt-8 md:mt-0">
      <Card className="mb-8">
        <h3 className="text-lg font-bold mb-4">Bài viết nổi bật</h3>
        {[
          'Gái Kèo Xu Hướng Nhất Đại Nhạc Hội 2024 - Ai?',
          'Làm Thế Nào Để Xác Định Rằng Lương?',
          'Cộng đồng ứng viên nói gì về Dụng Người Đúng...',
          'Nguồn cảm hứng để bắt đầu Dụng Người Đúng Việc',
          'Câu chuyện ra đời của Dụng Người Đúng Việc',
        ].map((title, index) => (
          <div key={index} className="flex items-center mb-4">
            <img src={``} alt={title} className="w-16 h-16 object-cover mr-4" />
            <p className="text-sm">{title}</p>
          </div>
        ))}
      </Card>
    </div>
  );
};

const Blogs = () => {
  const customBreadcrumbItems = [
    {
      path: PATH.BLOG,
      label: 'Blogs',
    },
  ];

  const breadcrumb = useBreadcrumb(customBreadcrumbItems);
  return (
    <>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {breadcrumb}
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 pr-0 md:pr-4">
          <BlogPost
            title="Top 5 khoảnh khắc ồ wow trong phỏng vấn"
            content="Những khoảnh khắc khiến nhà tuyển dụng ồ WOW trong quá trình phỏng vấn!"
            author="Anne"
            date="28/06/2024"
            image=""
          />
          <BlogPost
            title="Tips trả lời câu hỏi: Vì sao em làm trái ngành?"
            content="Khi ứng tuyển công việc trái với ngành học mình theo đuổi, nhiều bạn vẫn đắn đo..."
            author="Anne"
            date="28/06/2024"
            image=""
          />
        </div>
        <Sidebar />
      </div>
    </>
  );
};

export default Blogs;
