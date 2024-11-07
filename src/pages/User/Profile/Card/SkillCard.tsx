import { Flex, Rate } from 'antd';
import { memo } from 'react';

import UserApi from '~/apis/user';
import useMessageApi from '~/hooks/useMessageApi';
import { IUserSkill } from '~/types/User/profile';
import { ProfileSectionType } from '../ProfileSection';
import ProfileCard from './ProfileCard';

interface IProps {
  data: IUserSkill[];
  refetch: () => void;
  onEdit: (index: number, sectionType: ProfileSectionType) => void;
}

const SkillCard = ({ data, refetch, onEdit }: IProps) => {
  const { mutate: deleteUserSkill } = useMessageApi({
    apiFn: (id: number) => UserApi.deleteUserSkill(id),
    onSuccess: () => refetch(),
  });

  return (
    <Flex vertical gap={16}>
      {data?.map((item, index) => (
        <ProfileCard
          onDelete={() => deleteUserSkill(item.skillsId)}
          onEdit={() => onEdit(index, ProfileSectionType.SKILL)}
          key={index}
          content={
            <div className="space-y-2">
              <p className="text-base font-semibold">{item.skill.title}</p>
              <Rate value={item.level} />
            </div>
          }
        />
      ))}
    </Flex>
  );
};

export default memo(SkillCard);
