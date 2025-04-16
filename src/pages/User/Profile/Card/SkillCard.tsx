import { useMutation } from '@tanstack/react-query';
import { Flex, Rate } from 'antd';
import { memo } from 'react';

import UserAPI from '~/apis/user';
import { useMessage } from '~/contexts/MessageProvider';
import { PROFILE_SECTION_TYPE } from '~/enums';
import { IUserSkill } from '~/types/User/profile';
import ProfileCard from './ProfileCard';

interface IProps {
  data: IUserSkill[];
  refetch: () => void;
  onEdit: (index: number, sectionType: PROFILE_SECTION_TYPE) => void;
}

const SkillCard = ({ data, refetch, onEdit }: IProps) => {
  const { messageApi } = useMessage();

  const { mutate: deleteUserSkill } = useMutation({
    mutationFn: (id: number) => UserAPI.deleteUserSkill(id),
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
          onEdit={() => onEdit(index, PROFILE_SECTION_TYPE.SKILL)}
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
