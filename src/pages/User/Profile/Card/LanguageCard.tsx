import { Divider, Flex } from 'antd';

import { mockFileList } from '~/mocks/data';
import { UserLanguage } from '~/types/User';
import ProfileCard from './ProfileCard';
import { useEffect, useState } from 'react';
import { DefaultOptionType } from 'antd/es/select';

interface IProps {
  data: UserLanguage[];
}

const defaultImgUrl = mockFileList[0].url;

const LanguageCard = ({ data }: IProps) => {
  const [languageOptions, setLanguageOptions] = useState<DefaultOptionType[]>(
    []
  );

  useEffect(() => {
    
  }, []);

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
