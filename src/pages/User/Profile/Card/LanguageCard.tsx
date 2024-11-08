import { useMutation } from '@tanstack/react-query';
import { Divider, Flex } from 'antd';
import { memo } from 'react';

import UserApi from '~/apis/user';
import { useMessage } from '~/contexts/MessageProvider';
import { mockFileList } from '~/mocks/data';
import { IForeignLanguage } from '~/types/User/profile';
import { advanceOptions } from '../Modal/LanguageModal';
import { ProfileSectionType } from '../ProfileSection';
import ProfileCard from './ProfileCard';

interface IProps {
  data: IForeignLanguage[];
  refetch: () => void;
  onEdit: (index: number, sectionType: ProfileSectionType) => void;
}

const defaultImgUrl = mockFileList[0].url;

const LanguageCard = ({ data, refetch, onEdit }: IProps) => {
  const { messageApi } = useMessage();

  const { mutate: deleteUserLanguage } = useMutation({
    mutationFn: (id: number) => UserApi.deleteForeignLanguage(id),
    onSuccess: () => {
      messageApi.success('Xoá ngôn ngữ thành công');
      refetch();
    },
    onError: (error: any) =>
      messageApi.error(
        error?.response?.data?.message || 'Lỗi khi xoá ngôn ngữ'
      ),
  });

  return (
    <Flex vertical gap={16}>
      {data?.map((item, index) => (
        <div key={index}>
          <ProfileCard
            imgUrl={defaultImgUrl}
            onEdit={() => onEdit(index, ProfileSectionType.LANGUAGE)}
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
