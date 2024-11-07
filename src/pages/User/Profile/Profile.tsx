import { Divider } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { BriefCase, LanguageCenter, MagicHat, Summary } from '~/assets/img';
import { Achievement, Bag, Language, PencilSkill } from '~/assets/svg';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import ProfileSection, {
  IProfileSection,
  ProfileSectionType,
} from '~/pages/User/Profile/ProfileSection';
import { getUserProfile } from '~/store/thunk/user';
import { UserLanguage, UserSkill, WorkExperience } from '~/types/User/profile';
import toast from '~/utils/functions/toast';
import icons from '~/utils/icons';
import ExperienceCard from './Card/ExperienceCard';
import LanguageCard from './Card/LanguageCard';
import SkillCard from './Card/SkillCard';
import AchievementModal from './Modal/AchievementModal';
import ExperienceModal from './Modal/ExperienceModal';
import LanguageModal from './Modal/LanguageModal';
import SkillModal from './Modal/SkillModal';
import { useFetch } from '~/hooks/useFetch';
import UserApi from '~/apis/user';

const { PlusOutlined, EditOutlined } = icons;

const initExperience = {} as WorkExperience;
const initLanguage = {} as UserLanguage;
const initSkill = {} as UserSkill;

const Profile = () => {
  const dispatch = useAppDispatch();

  const [selectedItem, setSelectedItem] = useState('');

  const [experienceItemSelected, setExperienceItemSelected] =
    useState<WorkExperience>(initExperience);
  const [languageItemSelected, setLanguageItemSelected] =
    useState<UserLanguage>(initLanguage);
  const [skillItemSelected, setSkillItemSelected] =
    useState<UserSkill>(initSkill);

  const { currentUser } = useAppSelector((state) => state.auth);
  const { userProfile, loading } = useAppSelector((state) => state.user);

  // const {} = useFetch(UserApi.getAchievementByUserId);

  const refetchUserProfile = useCallback(() => {
    const accessToken = localStorage.getItem('token1');
    const refreshToken = localStorage.getItem('token2');

    if (!accessToken || !refreshToken) {
      toast.error('Lỗi không tìm thấy token');
      return;
    }

    dispatch(getUserProfile({ accessToken, refreshToken }));
  }, [currentUser]);

  const handleEditExperience = useCallback((values: WorkExperience) => {
    setExperienceItemSelected(values);
    setSelectedItem(ProfileSectionType.EXPERIENCE);
  }, []);

  const handleCancelExperience = useCallback(() => {
    setSelectedItem('');
    setExperienceItemSelected(initExperience);
  }, []);

  const handleEditLanguage = useCallback((values: UserLanguage) => {
    setLanguageItemSelected(values);
    setSelectedItem(ProfileSectionType.LANGUAGE);
  }, []);

  const handleCancelLanguage = useCallback(() => {
    setSelectedItem('');
    setLanguageItemSelected(initLanguage);
  }, []);

  const handleEditSkill = useCallback((values: UserSkill) => {
    setSkillItemSelected(values);
    setSelectedItem(ProfileSectionType.SKILL);
  }, []);

  const handleCancelSkill = useCallback(() => {
    setSelectedItem('');
    setSkillItemSelected(initSkill);
  }, []);

  const items: IProfileSection[] = useMemo(
    () => [
      {
        id: ProfileSectionType.ACHIEVEMENT,
        imgUrl: Summary,
        header: {
          title: 'Thành tích / Kỹ năng nổi bật',
          suffixIcon: (
            <Achievement width={20} height={20} className="font-bold" />
          ),
        },
        buttonTitle: 'Cập nhật tóm tắt',
        hint: 'Tóm tắt về thành tích / kỹ năng nổi bật giúp hồ sơ của bạn tăng 3.9 lần lượt tiếp cận từ nhà tuyển dụng.',
        tooltipTitle: 'Cập nhật',
        buttonActionTitle: (
          <EditOutlined className="text-[#691f74] cursor-pointer" />
        ),
        content: userProfile?.achivement?.description && (
          <div
            className="text-sm font-medium"
            dangerouslySetInnerHTML={{
              __html: userProfile.achivement.description,
            }}
          />
        ),
      },
      {
        id: ProfileSectionType.EXPERIENCE,
        imgUrl: BriefCase,
        header: {
          title: 'Kinh nghiệm',
          suffixIcon: <Bag width={20} height={20} className="font-bold" />,
        },
        buttonTitle: 'Thêm kinh nghiệm',
        hint: 'Thêm kinh nghiệm làm việc để giúp nhà tuyển dụng hiểu hơn về bạn',
        tooltipTitle: 'Thêm kinh nghiệm',
        buttonActionTitle: (
          <PlusOutlined className="text-[#691f74] cursor-pointer" />
        ),
        content: userProfile.workExperiences?.length && (
          <ExperienceCard
            data={userProfile.workExperiences}
            refetch={refetchUserProfile}
            onEdit={handleEditExperience}
          />
        ),
      },
      {
        id: ProfileSectionType.LANGUAGE,
        imgUrl: LanguageCenter,
        header: {
          title: 'Ngoại ngữ',
          suffixIcon: <Language width={20} height={20} className="font-bold" />,
        },
        tooltipTitle: 'Thêm ngoại ngữ',
        buttonTitle: 'Thêm ngoại ngữ',
        hint: 'Bạn biết những ngoại ngữ nào? Hãy thêm vào để tăng độ "hot" cho hồ sơ nhé.',
        buttonActionTitle: (
          <PlusOutlined className="text-[#691f74] cursor-pointer" />
        ),
        content: userProfile.userLanguages?.length && (
          <LanguageCard
            data={userProfile.userLanguages}
            refetch={refetchUserProfile}
            onEdit={handleEditLanguage}
          />
        ),
      },
      {
        id: ProfileSectionType.SKILL,
        imgUrl: MagicHat,
        header: {
          title: 'Kỹ năng / Công cụ',
          suffixIcon: (
            <PencilSkill width={20} height={20} className="font-bold" />
          ),
        },
        tooltipTitle: 'Thêm kỹ năng',
        buttonTitle: 'Thêm kỹ năng',
        hint: 'Kỹ năng / công cụ giúp bạn nổi bật hơn trong mắt nhà tuyển dụng.',
        buttonActionTitle: (
          <PlusOutlined className="text-[#691f74] cursor-pointer" />
        ),
        content: userProfile.userSkills?.length && (
          <SkillCard
            data={userProfile.userSkills}
            refetch={refetchUserProfile}
            onEdit={handleEditSkill}
          />
        ),
      },
    ],
    [userProfile]
  );

  useEffect(() => {
    refetchUserProfile();
  }, []);

  return (
    <>
      {items.map((item, index) => (
        <div key={index}>
          <ProfileSection
            {...item}
            loading={loading}
            onClick={() => setSelectedItem(item.id)}
          />
          {index !== items.length - 1 && <Divider />}
        </div>
      ))}
      <AchievementModal
        data={userProfile?.achivement?.description}
        isOpen={selectedItem === ProfileSectionType.ACHIEVEMENT}
        refetch={refetchUserProfile}
        onCancel={() => setSelectedItem('')}
      />
      <ExperienceModal
        data={experienceItemSelected}
        isOpen={selectedItem === ProfileSectionType.EXPERIENCE}
        refetch={refetchUserProfile}
        onCancel={handleCancelExperience}
      />
      <LanguageModal
        data={languageItemSelected}
        isOpen={selectedItem === ProfileSectionType.LANGUAGE}
        refetch={refetchUserProfile}
        onCancel={handleCancelLanguage}
      />
      <SkillModal
        data={skillItemSelected}
        isOpen={selectedItem === ProfileSectionType.SKILL}
        refetch={refetchUserProfile}
        onCancel={handleCancelSkill}
      />
    </>
  );
};

export default Profile;
