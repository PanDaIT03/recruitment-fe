import { useMutation } from '@tanstack/react-query';
import { Divider } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

import UserApi from '~/apis/user';
import { BriefCase, LanguageCenter, MagicHat, Summary } from '~/assets/img';
import { Achievement, Bag, Language, PencilSkill } from '~/assets/svg';
import { useMessage } from '~/contexts/MessageProvider';
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
  const { messageApi } = useMessage();
  const { currentUser } = useAppSelector((state) => state.auth);

  const [editIndex, setEditIndex] = useState<number>(-1);
  const [selectedItem, setSelectedItem] = useState('');

  const [workExperiences, setWorkExperiences] =
    useState<IWorkExperience[]>(initExperience);
  const [foreignLanguages, setForeignLanguages] =
    useState<IForeignLanguage[]>(initLanguage);
  const [userSkills, setUserSkills] = useState<IUserSkill[]>(initSkill);

  const {
    data: achievement,
    mutate: getAchievementByUserId,
    isPending: isAchievementPending,
  } = useMutation({
    mutationFn: (id: number) => UserApi.getAchievementByUserId(id),
    onError: (error: any) => {
      messageApi.error(error?.response?.data?.message);
    },
  });

  const { mutate: getLanguageByUserId, isPending: isLanguagePending } =
    useMutation({
      mutationFn: (id: number) => UserApi.getLanguageByUserId(id),
      onSuccess: (res) => setForeignLanguages(res.items),
      onError: (error: any) => {
        messageApi.error(error?.response?.data?.message);
      },
    });

  const { mutate: getUserSkillByUserId, isPending: isUserSkillPending } =
    useMutation({
      mutationFn: (id: number) => UserApi.getUserSkillByUserId(id),
      onSuccess: (res) => setUserSkills(res.items),
      onError: (error: any) => {
        messageApi.error(error?.response?.data?.message);
      },
    });

  const {
    mutate: getWorkExperienceByUserId,
    isPending: isWorkExperiencePending,
  } = useMutation({
    mutationFn: (id: number) => UserApi.getWorkExperienceByUserId(id),
    onSuccess: (res) => setWorkExperiences(res.items),
    onError: (error: any) => {
      messageApi.error(error?.response?.data?.message);
    },
  });

  useEffect(() => {
    const id = currentUser.id;
    if (!id) return;

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
        loading={isAchievementPending}
        onClick={() => setSelectedItem(ProfileSectionType.ACHIEVEMENT)}
      />
      <Divider />
      <ProfileSection
        {...workExperienceSection}
        loading={isWorkExperiencePending}
        onClick={() => setSelectedItem(ProfileSectionType.EXPERIENCE)}
      />
      <Divider />
      <ProfileSection
        {...foreignLanguageSection}
        loading={isLanguagePending}
        onClick={() => setSelectedItem(ProfileSectionType.LANGUAGE)}
      />
      <Divider />
      <ProfileSection
        {...userSkillSection}
        loading={isUserSkillPending}
        onClick={() => setSelectedItem(ProfileSectionType.SKILL)}
      />

      <AchievementModal
        data={achievement || initAchievement}
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
