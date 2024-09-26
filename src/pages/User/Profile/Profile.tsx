import { Divider } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { Achievement, Bag, Language, PencilSkill } from '~/assets/svg';

import ButtonAction from '~/components/Button/ButtonAction';
import ProfileSection, {
  IProfileSection,
} from '~/components/ProfileSection/ProfileSection';
import icons from '~/utils/icons';

const { PlusOutlined, EditOutlined } = icons;

const Profile = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleClick = useCallback(() => {
    setIsOpenModal(true);
  }, []);

  const items: IProfileSection[] = useMemo(
    () => [
      {
        header: {
          title: 'Thành tích / Kỹ năng nổi bật',
          suffixIcon: (
            <Achievement width={20} height={20} className="font-bold" />
          ),
        },
        buttonTitle: 'Cập nhật tóm tắt',
        content:
          'Tóm tắt về thành tích / kỹ năng nổi bật giúp hồ sơ của bạn tăng 3.9 lần lượt tiếp cận từ nhà tuyển dụng.',
        buttonAction: (
          <ButtonAction
            title={<EditOutlined className="text-[#691f74] cursor-pointer" />}
            onClick={handleClick}
          />
        ),
      },
      {
        header: {
          title: 'Kinh nghiệm',
          suffixIcon: <Bag width={20} height={20} className="font-bold" />,
        },
        buttonTitle: 'Thêm kinh nghiệm',
        content:
          'Thêm kinh nghiệm làm việc để giúp nhà tuyển dụng hiểu hơn về bạn',
        buttonAction: (
          <ButtonAction
            title={<PlusOutlined className="text-[#691f74] cursor-pointer" />}
            onClick={handleClick}
          />
        ),
      },
      {
        header: {
          title: 'Ngoại ngữ',
          suffixIcon: <Language width={20} height={20} className="font-bold" />,
        },
        buttonTitle: 'Thêm ngoại ngữ',
        content:
          'Bạn biết những ngoại ngữ nào? Hãy thêm vào để tăng độ "hot" cho hồ sơ nhé.',
        buttonAction: (
          <ButtonAction
            title={<PlusOutlined className="text-[#691f74] cursor-pointer" />}
            onClick={handleClick}
          />
        ),
      },
      {
        header: {
          title: 'Kỹ năng / Công cụ',
          suffixIcon: (
            <PencilSkill width={20} height={20} className="font-bold" />
          ),
        },
        buttonTitle: 'Thêm kỹ năng',
        content:
          'Kỹ năng / công cụ giúp bạn nổi bật hơn trong mắt nhà tuyển dụng.',
        buttonAction: (
          <ButtonAction
            title={<PlusOutlined className="text-[#691f74] cursor-pointer" />}
            onClick={handleClick}
          />
        ),
      },
    ],
    []
  );

  return (
    <>
      {items.map((item, index) => (
        <>
          <ProfileSection key={index} {...item} onClick={handleClick} />
          {index !== items.length - 1 && <Divider />}
        </>
      ))}
    </>
  );
};

export default Profile;
