import { Divider } from 'antd';
import dayjs from 'dayjs';
import { Dispatch, memo, SetStateAction, useCallback } from 'react';

import UserApi from '~/apis/user';
import { useMessage } from '~/contexts/messageProvider';
import { mockFileList } from '~/mocks/data';
import { IWorkExperience } from '~/types/User';
import { ProfileSectionType } from '../ProfileSection';
import ProfileCard from './ProfileCard';

interface IProps {
  data: IWorkExperience[];
  refetch: () => void;
  onEdit(values: IWorkExperience): void;
  setSelectedItem: Dispatch<SetStateAction<string>>;
}

const defaultImgUrl = mockFileList[0].url;

const ExperienceCard = ({ data, refetch, onEdit, setSelectedItem }: IProps) => {
  const { messageApi } = useMessage();

  const handleEditItem = useCallback(
    (values: IWorkExperience) => {
      onEdit(values);
      setSelectedItem(ProfileSectionType.EXPERIENCE);
    },
    [onEdit]
  );

  const handleDeleteItem = useCallback(
    async (id: number) => {
      try {
        const { message, statusCode } = await UserApi.deleteWorkExperience(id);

        if (statusCode === 200) refetch();
        messageApi.success(message);
      } catch (error: any) {
        messageApi.error(`Có lỗi xảy ra: ${error?.response?.data?.message}`);
      }
    },
    [messageApi]
  );

  return (
    <>
      {data?.map((item, index) => (
        <div key={index}>
          <ProfileCard
            imgUrl={defaultImgUrl}
            onEdit={() => handleEditItem(item)}
            onDelete={() => handleDeleteItem(item.id)}
            content={
              <div className="space-y-1">
                <p className="text-base font-semibold">
                  {item.jobPosition.title}
                </p>
                <p>
                  <span className="text-base font-medium">
                    {item.companyName}
                  </span>
                  <span className="text-sm text-sub font-medium before:content-['•'] before:mx-2 before:text-sm">
                    {item.jobCategory.name}
                  </span>
                </p>
                <p className="text-sm text-sub font-medium">
                  {dayjs(item.startDate).format('DD/MM/YYYY')} -{' '}
                  {item.endDate
                    ? dayjs(item.endDate).format('DD/MM/YYYY')
                    : 'Hiện tại'}
                </p>
                <p className="text-sm text-sub font-medium">
                  {item.placement.title}
                </p>
                <p className="text-sm font-medium">{item.description}</p>
              </div>
            }
          />
          {index < data.length - 1 && <Divider dashed className="my-4" />}
        </div>
      ))}
    </>
  );
};

export default memo(ExperienceCard);
