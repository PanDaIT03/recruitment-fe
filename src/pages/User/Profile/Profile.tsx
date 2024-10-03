import { Divider } from 'antd';
import { useMemo, useState } from 'react';

import { BriefCase, LanguageCenter, MagicHat, Summary } from '~/assets/img';
import { Achievement, Bag, Language, PencilSkill } from '~/assets/svg';
import ProfileSection, {
  IProfileSection,
  ProfileSectionType,
} from '~/pages/User/Profile/ProfileSection';
import icons from '~/utils/icons';
import AchievementModal from './Modal/AchievementModal';
import ModalExperience from './Modal/ExperienceModal';
import LanguageModal from './Modal/LanguageModal';
import SkillModal from './Modal/SkillModal';

const { PlusOutlined, EditOutlined } = icons;

const Profile = () => {
  const [selectedItem, setSelectedItem] = useState('');

  const items: IProfileSection[] = useMemo(
    () => [
      {
        id: ProfileSectionType.ACHIEVEMENT,
        img: Summary,
        header: {
          title: 'Thành tích / Kỹ năng nổi bật',
          suffixIcon: (
            <Achievement width={20} height={20} className="font-bold" />
          ),
        },
        buttonTitle: 'Cập nhật tóm tắt',
        content:
          'Tóm tắt về thành tích / kỹ năng nổi bật giúp hồ sơ của bạn tăng 3.9 lần lượt tiếp cận từ nhà tuyển dụng.',
        buttonActionTitle: (
          <EditOutlined className="text-[#691f74] cursor-pointer" />
        ),
      },
      {
        id: ProfileSectionType.EXPERIENCE,
        img: BriefCase,
        header: {
          title: 'Kinh nghiệm',
          suffixIcon: <Bag width={20} height={20} className="font-bold" />,
        },
        buttonTitle: 'Thêm kinh nghiệm',
        content:
          'Thêm kinh nghiệm làm việc để giúp nhà tuyển dụng hiểu hơn về bạn',
        buttonActionTitle: (
          <PlusOutlined className="text-[#691f74] cursor-pointer" />
        ),
      },
      {
        id: ProfileSectionType.LANGUAGE,
        img: LanguageCenter,
        header: {
          title: 'Ngoại ngữ',
          suffixIcon: <Language width={20} height={20} className="font-bold" />,
        },
        buttonTitle: 'Thêm ngoại ngữ',
        content:
          'Bạn biết những ngoại ngữ nào? Hãy thêm vào để tăng độ "hot" cho hồ sơ nhé.',
        buttonActionTitle: (
          <PlusOutlined className="text-[#691f74] cursor-pointer" />
        ),
      },
      {
        id: ProfileSectionType.SKILL,
        img: MagicHat,
        header: {
          title: 'Kỹ năng / Công cụ',
          suffixIcon: (
            <PencilSkill width={20} height={20} className="font-bold" />
          ),
        },
        buttonTitle: 'Thêm kỹ năng',
        content:
          'Kỹ năng / công cụ giúp bạn nổi bật hơn trong mắt nhà tuyển dụng.',
        buttonActionTitle: (
          <PlusOutlined className="text-[#691f74] cursor-pointer" />
        ),
      },
    ],
    []
  );

  return (
    <>
      {items.map((item, index) => (
        <div key={index}>
          <ProfileSection {...item} onClick={() => setSelectedItem(item.id)} />
          {index !== items.length - 1 && <Divider />}
        </div>
      ))}
      <AchievementModal
        isOpen={selectedItem === ProfileSectionType.ACHIEVEMENT}
        setSelectedItem={setSelectedItem}
      />
      <ModalExperience
        isOpen={selectedItem === ProfileSectionType.EXPERIENCE}
        setSelectedItem={setSelectedItem}
      />
      <LanguageModal
        isOpen={selectedItem === ProfileSectionType.LANGUAGE}
        setSelectedItem={setSelectedItem}
      />
      <SkillModal
        isOpen={selectedItem === ProfileSectionType.SKILL}
        setSelectedItem={setSelectedItem}
      />
    </>
  );
};

export default Profile;
