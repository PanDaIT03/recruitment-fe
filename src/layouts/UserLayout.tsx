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
import { ReactNode, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import { ProfileCoverImage } from '~/assets/img';
import { DualLayerFile, File, PersonCard, SkyScraper } from '~/assets/svg';
import { useAppSelector } from '~/hooks/useStore';
import { mockFileList } from '~/mocks/data';
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

const { SettingOutlined, UserOutlined, HomeOutlined } = icons;

const items: Items[] = [
  {
    title: 'Hồ sơ',
    children: [
      {
        title: 'Cá nhân',
        href: PATH.USER_PROFILE,
        icon: <PersonCard width={18} height={18} />,
      },
      {
        title: 'Công việc mong muốn',
        href: PATH.USER_DESIRED_JOB,
        icon: <DualLayerFile width={18} height={18} />,
      },
      {
        title: 'CV',
        href: PATH.USER_PROFILE,
        icon: <File width={16} height={16} />,
      },
    ],
  },
  {
    title: 'Công việc',
    children: [
      {
        title: 'Doanh nghiệp tiếp cận',
        href: PATH.USER_PROFILE,
        icon: <SkyScraper width={18} height={18} />,
      },
    ],
  },
];

const UserLayout = () => {
  const navigate = useNavigate();

  const { currentUser } = useAppSelector((state) => state.auth);
  const [fileList, setFileList] = useState<UploadFile[]>(mockFileList);

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
                src={ProfileCoverImage}
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
                    <Link
                      key={index}
                      to={child.href}
                      className="flex p-2 items-center gap-2 rounded-md cursor-pointer hover:bg-[#f5f5f5] hover:text-[#000000E0]"
                    >
                      <span>{child.icon}</span>
                      <span>{child.title}</span>
                    </Link>
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
