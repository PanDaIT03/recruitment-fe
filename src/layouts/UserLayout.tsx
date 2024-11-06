import { Divider, Flex, Image, Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Dispatch, ReactNode, useCallback } from 'react';
import { Link, Outlet } from 'react-router-dom';

import { DualLayerFile, File, PersonCard, SkyScraper } from '~/assets/svg';
import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import { useAppSelector } from '~/hooks/useStore';
import { defaultCoverImage } from '~/mocks/data';
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

interface ISiderProps {}

const { EditOutlined } = icons;

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

const Sider = ({}: ISiderProps) => {
  const { currentUser } = useAppSelector((state) => state.auth);

  return (
    <Flex vertical className="lg:col-span-3" gap={16}>
      <div className="overflow-hidden rounded-xl bg-white shadow-card p-0">
        <div className="w-full">
          <div className="h-[9rem] bg-[url('assets/img/profile_cover_image.jpg')] bg-cover bg-center bg-no-repeat"></div>
          <div className="-mt-[59px] px-6 pb-6">
            <Flex align="end" justify="space-between" gap={16}>
              <div className="relative w-fit rounded-full border-[3px] border-white">
                <div className="rounded-full bg-white w-[108px] h-[108px]">
                  <div className="inline-block aspect-square h-full w-full rounded-full border border-gray-200 overflow-hidden">
                    <Image width={108} height={108} src={defaultCoverImage} />
                  </div>
                </div>
                <ButtonAction
                  tooltipTitle="Sửa"
                  title={<EditOutlined className="text-white cursor-pointer" />}
                  className="bg-[#691f74] py-[2px] px-[6px] absolute bottom-0 right-0 hover:bg-[#461a53]"
                  // onClick={handleClickEditThumbNail}
                />
              </div>
              <Button
                title="Sửa"
                borderType="dashed"
                iconBefore={<EditOutlined />}
                // onClick={handleClickEditInfo}
              />
            </Flex>
            <div className="mt-4">
              <p className="text-lg font-semibold">{currentUser.fullName}</p>
              <p className="text-sm text-sub font-normal">
                {currentUser.email}
              </p>
            </div>
          </div>
          <Divider dashed className="!m-0" />
          <div className="flex flex-col gap-4 mt-3 px-6 py-6">
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
        </div>
      </div>
    </Flex>
  );
};

const UserLayout = () => {
  const handleClickEditThumbNail = useCallback(() => {
    console.log('edit thumbnail');
  }, []);

  const handleClickEditInfo = useCallback(() => {
    console.log('edit info');
  }, []);

  return (
    <Layout>
      <Header />
      <div className="w-full py-4 px-8 mx-auto max-w-7xl min-h-screen grid grid-cols-1 lg:grid-cols-10">
        <Sider />
        <Content className="pl-6 bg-gray-100 lg:col-span-7">
          <div className="bg-white p-4 rounded-lg shadow">
            <Outlet />
          </div>
        </Content>
      </div>
    </Layout>
  );
};

export default UserLayout;
