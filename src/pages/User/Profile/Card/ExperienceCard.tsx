import { useMutation } from '@tanstack/react-query';
import { Divider } from 'antd';
import dayjs from 'dayjs';
import { memo } from 'react';

import UserAPI from '~/apis/user';
import { CompanyLogo } from '~/assets/svg';
import { useMessage } from '~/contexts/MessageProvider';
import { PROFILE_SECTION_TYPE } from '~/enums';
import { IWorkExperience } from '~/types/User/profile';
import ProfileCard from './ProfileCard';

interface IProps {
  data: IWorkExperience[];
  refetch: () => void;
  onEdit: (index: number, sectionType: PROFILE_SECTION_TYPE) => void;
}

const ExperienceCard = ({ data, refetch, onEdit }: IProps) => {
  const { messageApi } = useMessage();

  const { mutate: deleteWorkExperience } = useMutation({
    mutationFn: (id: number) => UserAPI.deleteWorkExperience(id),
    onSuccess: (res) => {
      messageApi.success(res?.message);
      refetch();
    },
    onError: (error: any) =>
      messageApi.error(
        error?.response?.data?.message || 'Lỗi khi xoá kinh nghiệm'
      ),
  });

  return (
    <>
      {data?.map((item, index) => (
        <div key={index}>
          <ProfileCard
            imgUrl={<CompanyLogo />}
            onDelete={() => deleteWorkExperience(item.id)}
            onEdit={() => onEdit(index, PROFILE_SECTION_TYPE.EXPERIENCE)}
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
