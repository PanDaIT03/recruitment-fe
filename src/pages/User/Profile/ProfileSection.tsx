import { Image } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';
import { memo, ReactElement, ReactNode } from 'react';

import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import icons from '~/utils/icons';

type TitleType = { title: string; suffixIcon: ReactElement } | string;

export enum ProfileSectionType {
  ACHIEVEMENT = 'achievement',
  EXPERIENCE = 'experience',
  LANGUAGE = 'language',
  SKILL = 'skill',
}

export interface IProfileSection {
  img: string;
  id: ProfileSectionType;
  header: TitleType;
  hint: string;
  content?: ReactNode;
  buttonTitle: ReactNode;
  buttonActionTitle?: ReactNode;
  onClick?: () => void;
}

const { PlusOutlined } = icons;

const ProfileSection = ({
  img,
  hint,
  header,
  content,
  buttonTitle,
  buttonActionTitle,
  onClick,
}: IProfileSection) => {
  return (
    <>
      <div className="flex mb-8 justify-between items-center">
        <div className="flex items-center gap-4">
          {typeof header === 'string' ? (
            <Title level={4} className="!mb-0">
              {header}
            </Title>
          ) : (
            <>
              {header.suffixIcon}
              <Title level={4} className="!mb-0">
                {header.title}
              </Title>
            </>
          )}
        </div>
        {buttonActionTitle && (
          <ButtonAction title={buttonActionTitle} onClick={onClick} />
        )}
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        <Image
          src={img}
          width={96}
          height={96}
          preview={false}
          className="rounded-full p-4 bg-gray-100"
        />
        <Paragraph className="text-center text-sm text-sub italic max-w-md">
          {hint}
        </Paragraph>
        <Button
          borderType="dashed"
          title={buttonTitle}
          iconBefore={<PlusOutlined />}
          onClick={onClick}
        />
      </div>
    </>
  );
};

export default memo(ProfileSection);
