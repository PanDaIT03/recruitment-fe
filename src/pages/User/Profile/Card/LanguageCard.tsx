import { Divider, Flex } from 'antd';

import { mockFileList } from '~/mocks/data';
import { UserLanguage } from '~/types/User';
import ProfileCard from './ProfileCard';

interface IProps {
  data: UserLanguage[];
}

const defaultImgUrl = mockFileList[0].url;

const LanguageCard = ({ data }: IProps) => {
  return (
    <Flex vertical gap={16}>
      {data?.map((item, index) => (
        <div key={index}>
          <ProfileCard
            imgUrl={defaultImgUrl}
            content={
              <div className="space-y-1">
                <p className="text-base font-semibold">
                  {item.foreignLanguage.title}
                </p>
                <p className="text-sm text-sub font-medium">{item.level}</p>
              </div>
            }
          />
          {index < data.length - 1 && <Divider dashed className="my-4" />}
        </div>
      ))}
    </Flex>
  );
};

export default LanguageCard;
