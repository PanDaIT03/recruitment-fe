import { Divider, Flex } from 'antd';
import { Dispatch, SetStateAction, useCallback } from 'react';

import { mockFileList } from '~/mocks/data';
import { UserLanguage } from '~/types/User';
import { advanceOptions } from '../Modal/LanguageModal';
import { ProfileSectionType } from '../ProfileSection';
import ProfileCard from './ProfileCard';

interface IProps {
  data: UserLanguage[];
  refetch: () => void;
  onEdit: (values: UserLanguage) => void;
  setSelectedItem: Dispatch<SetStateAction<string>>;
}

const defaultImgUrl = mockFileList[0].url;

const LanguageCard = ({ data, onEdit, setSelectedItem }: IProps) => {
  // const { mutate: deleteUserLanguage } = useMessageApi({
  //   apiFn: (id: number) => UserApi.deleteForeignLanguage(id),
  // });

  const handleEditItem = useCallback((values: UserLanguage) => {
    onEdit(values);
    setSelectedItem(ProfileSectionType.LANGUAGE);
  }, []);

  // const handleDeleteItem = useCallback((id: number) => {
  //   console.log(id);

  // }, []);

  return (
    <Flex vertical gap={16}>
      {data?.map((item, index) => (
        <div key={index}>
          <ProfileCard
            imgUrl={defaultImgUrl}
            onEdit={() => handleEditItem(item)}
            // onDelete={() => handleDeleteItem(item.)}
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

export default LanguageCard;
