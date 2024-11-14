import { useMutation } from '@tanstack/react-query';
import { Flex, Rate } from 'antd';
import { memo } from 'react';

import UserApi from '~/apis/user';
import { useMessage } from '~/contexts/MessageProvider';
import { IUserSkill } from '~/types/User/profile';
import { ProfileSectionType } from '../ProfileSection';
import ProfileCard from './ProfileCard';

interface IProps {
  data: IUserSkill[];
  refetch: () => void;
  onEdit: (index: number, sectionType: ProfileSectionType) => void;
}

const SkillCard = ({ data, refetch, onEdit }: IProps) => {
  const { messageApi } = useMessage();

  const { mutate: deleteUserSkill } = useMutation({
    mutationFn: (id: number) => UserApi.deleteUserSkill(id),
    onSuccess: (res) => {
      messageApi.success(res?.message);
      refetch();
    },
    onError: (error: any) =>
      messageApi.error(error?.response?.data?.message || 'Lỗi khi xoá kỹ năng'),
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
