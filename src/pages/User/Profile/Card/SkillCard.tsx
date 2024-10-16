import { Flex, Rate } from 'antd';
import ProfileCard from './ProfileCard';
import { UserSkill } from '~/types/User';

interface IProps {
  data: UserSkill[];
}

const SkillCard = ({ data }: IProps) => {
  return (
    <Flex vertical gap={16}>
      {data?.map((item, index) => (
        <ProfileCard
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

export default SkillCard;
