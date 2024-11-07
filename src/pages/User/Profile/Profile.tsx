import { Divider } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

import UserApi from '~/apis/user';
import { BriefCase, LanguageCenter, MagicHat, Summary } from '~/assets/img';
import { Achievement, Bag, Language, PencilSkill } from '~/assets/svg';
import useMessageApi from '~/hooks/useMessageApi';
import { useAppSelector } from '~/hooks/useStore';
import ProfileSection, {
  IProfileSection,
  ProfileSectionType,
} from '~/pages/User/Profile/ProfileSection';
import {
  IAchievement,
  IForeignLanguage,
  IUserSkill,
  IWorkExperience,
} from '~/types/User/profile';
import icons from '~/utils/icons';
import ExperienceCard from './Card/ExperienceCard';
import LanguageCard from './Card/LanguageCard';
import SkillCard from './Card/SkillCard';
import AchievementModal from './Modal/AchievementModal';
import ExperienceModal from './Modal/ExperienceModal';
import LanguageModal from './Modal/LanguageModal';
import SkillModal from './Modal/SkillModal';

const { PlusOutlined, EditOutlined } = icons;

const initSkill = [] as IUserSkill[];
const initAchievement = {} as IAchievement;
const initLanguage = [] as IForeignLanguage[];
const initExperience = [] as IWorkExperience[];

const Profile = () => {
  const { currentUser } = useAppSelector((state) => state.auth);

  const [editIndex, setEditIndex] = useState<number>(-1);
  const [selectedItem, setSelectedItem] = useState('');

  const [userSkills, setUserSkills] = useState<IUserSkill[]>(initSkill);
  const [achievement, setAchievement] = useState<IAchievement>(initAchievement);
  const [workExperiences, setWorkExperiences] =
    useState<IWorkExperience[]>(initExperience);
  const [foreignLanguages, setForeignLanguages] =
    useState<IForeignLanguage[]>(initLanguage);

  const { mutate: getAchievementByUserId, isPending: getAchievementPending } =
    useMessageApi({
      showProcessMessage: false,
      apiFn: (id: number) => UserApi.getAchievementByUserId(id),
      onSuccess: (res) => {
        setAchievement(res);
      },
    });

  const { mutate: getLanguageByUserId, isPending: getLanguagePending } =
    useMessageApi({
      showProcessMessage: false,
      apiFn: (id: number) => UserApi.getLanguageByUserId(id),
      onSuccess: (res) => {
        const items = res?.items;
        setForeignLanguages(items);
      },
    });

  const { mutate: getUserSkillByUserId, isPending: getUserSkillPending } =
    useMessageApi({
      showProcessMessage: false,
      apiFn: (id: number) => UserApi.getUserSkillByUserId(id),
      onSuccess: (res) => {
        const items = res?.items;
        setUserSkills(items);
      },
    });

  const { mutate: getWorkExperienceByUserId, isPending: getExperiencePending } =
    useMessageApi({
      showProcessMessage: false,
      apiFn: (id: number) => UserApi.getWorkExperienceByUserId(id),
      onSuccess: (res) => {
        const items = res?.items;
        setWorkExperiences(items);
      },
    });

  useEffect(() => {
    const id = currentUser.id;

    getLanguageByUserId(id);
    getUserSkillByUserId(id);
    getAchievementByUserId(id);
    getWorkExperienceByUserId(id);
  }, [currentUser]);

  const handleEditItem = useCallback(
    (index: number, sectionType: ProfileSectionType) => {
      setEditIndex(index);
      setSelectedItem(sectionType);
    },
    []
  );

  const handleCancelEdit = useCallback(() => {
    setEditIndex(-1);
    setSelectedItem('');
  }, []);

  const achievementSection: IProfileSection = useMemo(
    () => ({
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
      content: achievement?.description && (
        <div
          className="text-sm font-medium"
          dangerouslySetInnerHTML={{
            __html: achievement.description,
          }}
        />
      ),
    }),
    [achievement]
  );

  const workExperienceSection: IProfileSection = useMemo(
    () => ({
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
      content: workExperiences?.length && (
        <ExperienceCard
          data={workExperiences}
          onEdit={handleEditItem}
          refetch={() => getWorkExperienceByUserId(currentUser.id)}
        />
      ),
    }),
    [workExperiences, currentUser]
  );

  const foreignLanguageSection = useMemo(
    () => ({
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
      content: foreignLanguages?.length && (
        <LanguageCard
          data={foreignLanguages}
          onEdit={handleEditItem}
          refetch={() => getLanguageByUserId(currentUser.id)}
        />
      ),
    }),
    [foreignLanguages, currentUser]
  );

  const userSkillSection = useMemo(
    () => ({
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
      content: userSkills?.length && (
        <SkillCard
          data={userSkills}
          onEdit={handleEditItem}
          refetch={() => getUserSkillByUserId(currentUser.id)}
        />
      ),
    }),
    [userSkills, currentUser]
  );

  return (
    <>
      <ProfileSection
        {...achievementSection}
        loading={getAchievementPending}
        onClick={() => setSelectedItem(ProfileSectionType.ACHIEVEMENT)}
      />
      <Divider />
      <ProfileSection
        {...workExperienceSection}
        loading={getExperiencePending}
        onClick={() => setSelectedItem(ProfileSectionType.EXPERIENCE)}
      />
      <Divider />
      <ProfileSection
        {...foreignLanguageSection}
        loading={getLanguagePending}
        onClick={() => setSelectedItem(ProfileSectionType.LANGUAGE)}
      />
      <Divider />
      <ProfileSection
        {...userSkillSection}
        loading={getUserSkillPending}
        onClick={() => setSelectedItem(ProfileSectionType.SKILL)}
      />

      <AchievementModal
        data={achievement}
        isOpen={selectedItem === ProfileSectionType.ACHIEVEMENT}
        onCancel={() => setSelectedItem('')}
        refetch={() => getAchievementByUserId(currentUser.id)}
      />
      <ExperienceModal
        data={workExperiences[editIndex]}
        isOpen={selectedItem === ProfileSectionType.EXPERIENCE}
        onCancel={handleCancelEdit}
        refetch={() => getWorkExperienceByUserId(currentUser.id)}
      />
      <LanguageModal
        data={foreignLanguages[editIndex]}
        isOpen={selectedItem === ProfileSectionType.LANGUAGE}
        onCancel={handleCancelEdit}
        refetch={() => getLanguageByUserId(currentUser.id)}
      />
      <SkillModal
        data={userSkills[editIndex]}
        isOpen={selectedItem === ProfileSectionType.SKILL}
        onCancel={handleCancelEdit}
        refetch={() => getUserSkillByUserId(currentUser.id)}
      />
    </>
  );
};

export default Profile;
