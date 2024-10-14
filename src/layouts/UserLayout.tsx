import {
  Card,
  Divider,
  GetProp,
  Layout,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import Meta from 'antd/es/card/Meta';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { ReactNode, useMemo, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector } from '~/hooks/useStore';
import { defaultCoverImage, mockFileList } from '~/mocks/data';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import Header from './Header/Header';

interface IChildren {
  title: string;
  href: string;
  icon: ReactNode;
}

interface Items {
  title: string;
  children: IChildren[];
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const {
  CalendarOutlined,
  FilePdfOutlined,
  SettingOutlined,
  ShopOutlined,
  UserOutlined,
  HomeOutlined,
} = icons;

const items: Items[] = [
  {
    title: 'Hồ sơ',
    children: [
      {
        title: 'Cá nhân',
        icon: <UserOutlined />,
        href: PATH.USER_PROFILE,
      },
      {
        title: 'Công việc mong muốn',
        icon: <CalendarOutlined />,
        href: PATH.USER_PROFILE,
      },
      {
        title: 'CV',
        icon: <FilePdfOutlined />,
        href: PATH.USER_PROFILE,
      },
    ],
  },
  {
    title: 'Công việc',
    children: [
      {
        title: 'Doanh nghiệp tiếp cận',
        icon: <ShopOutlined />,
        href: PATH.USER_PROFILE,
      },
    ],
  },
];

const UserLayout = () => {
  const navigate = useNavigate();

  const { currentUser } = useAppSelector((state) => state.auth);
  const [fileList, setFileList] = useState<UploadFile[]>(mockFileList);

  const coverImageUrl = useMemo(() => {
    return fileList.length > 0 && fileList[0].url
      ? fileList[0].url
      : defaultCoverImage;
  }, [fileList]);

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }

    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <Layout className="min-h-screen">
      <Header />
      <Layout className="w-full py-4 px-8 mx-auto max-w-7xl min-h-screen">
        <Sider
          width={400}
          theme="light"
          className="h-max rounded-xl overflow-hidden shadow-md"
        >
          <Card
            cover={
              <img
                alt="example"
                src={coverImageUrl}
                style={{ height: 200, objectFit: 'cover', borderRadius: 0 }}
              />
            }
            actions={[
              <HomeOutlined
                key="home"
                style={{ fontSize: 24 }}
                onClick={() => navigate(PATH.ROOT)}
              />,
              <SettingOutlined
                key="setting"
                style={{ fontSize: 24 }}
                onClick={() => navigate(PATH.USER_ACCOUNT)}
              />,
            ]}
          >
            <Meta
              avatar={
                <Upload
                  fileList={fileList}
                  listType="picture-card"
                  onChange={onChange}
                  onPreview={onPreview}
                  action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                >
                  {fileList.length < 1 && <UserOutlined />}
                </Upload>
              }
              title={currentUser.fullName}
              description="This is the description"
            />
            <Divider dashed />
            <div className="flex flex-col gap-4 mt-3">
              {items.map((item, index) => (
                <div key={index}>
                  <h3 className="font-bold">{item.title}</h3>
                  {item.children.map((child, index) => (
                    <p
                      key={index}
                      className="flex p-2 items-center gap-2 rounded-md cursor-pointer hover:bg-[#f5f5f5]"
                    >
                      <span>{child.icon}</span>
                      <Link to={child.href} className="hover:text-[#000000E0]">
                        {child.title}
                      </Link>
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        </Sider>
        <Content className="pl-6 bg-gray-100">
          <div className="bg-white p-4 rounded-lg shadow">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserLayout;
