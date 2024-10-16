import { Divider, Flex } from 'antd';
import { memo } from 'react';

import UserApi from '~/apis/user';
import useMessageApi from '~/hooks/useMessageApi';
import { mockFileList } from '~/mocks/data';
import { UserLanguage } from '~/types/User';
import { advanceOptions } from '../Modal/LanguageModal';
import ProfileCard from './ProfileCard';

interface IProps {
  data: UserLanguage[];
  refetch: () => void;
  onEdit: (values: UserLanguage) => void;
}

const defaultImgUrl = mockFileList[0].url;

const LanguageCard = ({ data, refetch, onEdit }: IProps) => {
  const { mutate: deleteUserLanguage } = useMessageApi({
    apiFn: (id: number) => UserApi.deleteForeignLanguage(id),
    onSuccess: () => refetch(),
  });

  return (
    <Flex vertical gap={16}>
      {data?.map((item, index) => (
        <div key={index}>
          <ProfileCard
            imgUrl={defaultImgUrl}
            onEdit={() => onEdit(item)}
            onDelete={() => deleteUserLanguage(item.foreignLanguagesId)}
            content={
              <div className="space-y-1">
                <p className="text-base font-semibold">
                  {item.foreignLanguage.title}
                </p>
                <p className="text-sm text-sub font-medium">
                  {
                    advanceOptions.find(
                      (option) => option.value === item.level.toString()
                    )?.label
                  }
                </p>
              </div>
            }
          />
          {index < data.length - 1 && <Divider dashed className="my-4" />}
        </div>
      ))}
    </Flex>
  );
};

export default memo(LanguageCard);
