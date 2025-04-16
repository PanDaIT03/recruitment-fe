import { useMutation } from '@tanstack/react-query';
import { Divider, Flex } from 'antd';
import { memo } from 'react';

import UserAPI from '~/apis/user';
import { useMessage } from '~/contexts/MessageProvider';
import { PROFILE_SECTION_TYPE } from '~/enums';
import { IForeignLanguage } from '~/types/User/profile';
import { defaultImgUrl } from '~/utils/constant';
import { advanceOptions } from '../Modal/LanguageModal';
import ProfileCard from './ProfileCard';

interface IProps {
  data: IForeignLanguage[];
  refetch: () => void;
  onEdit: (index: number, sectionType: PROFILE_SECTION_TYPE) => void;
}

const LanguageCard = ({ data, refetch, onEdit }: IProps) => {
  const { messageApi } = useMessage();

  const { mutate: deleteUserLanguage } = useMutation({
    mutationFn: (id: number) => UserAPI.deleteForeignLanguage(id),
    onSuccess: (res) => {
      messageApi.success(res?.message);
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
            onEdit={() => onEdit(index, PROFILE_SECTION_TYPE.LANGUAGE)}
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
