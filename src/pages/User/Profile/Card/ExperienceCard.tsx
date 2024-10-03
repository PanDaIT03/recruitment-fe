import { Divider } from 'antd';
import dayjs from 'dayjs';
import { memo } from 'react';

import { mockFileList } from '~/mocks/data';
import { IWorkExperience } from '~/types/User';
import ProfileCard from './ProfileCard';

interface IProps {
  data: IWorkExperience[];
}

const defaultImgUrl = mockFileList[0].url;

const ExperienceCard = ({ data }: IProps) => {
  return (
    <>
      {data?.map((item, index) => (
        <>
          <ProfileCard
            key={index}
            imgUrl={defaultImgUrl}
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
        </>
      ))}
    </>
  );
};

export default memo(ExperienceCard);
