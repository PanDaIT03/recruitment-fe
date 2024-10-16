import { Divider } from 'antd';
import dayjs from 'dayjs';
import { Dispatch, memo, SetStateAction, useCallback } from 'react';

import UserApi from '~/apis/user';
import useMessageApi from '~/hooks/useMessageApi';
import { mockFileList } from '~/mocks/data';
import { WorkExperience } from '~/types/User';
import { ProfileSectionType } from '../ProfileSection';
import ProfileCard from './ProfileCard';

interface IProps {
  data: WorkExperience[];
  refetch: () => void;
  onEdit(values: WorkExperience): void;
  setSelectedItem: Dispatch<SetStateAction<string>>;
}

const defaultImgUrl = mockFileList[0].url;

const ExperienceCard = ({ data, refetch, onEdit, setSelectedItem }: IProps) => {
  const { mutate: deleteWorkExperience } = useMessageApi({
    apiFn: (id: number) => UserApi.deleteWorkExperience(id),
    onSuccess: () => {
      refetch();
    },
  });

  const handleEditItem = useCallback((values: WorkExperience) => {
    onEdit(values);
    setSelectedItem(ProfileSectionType.EXPERIENCE);
  }, []);

  const handleDeleteItem = useCallback(async (id: number) => {
    deleteWorkExperience(id);
  }, []);

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
