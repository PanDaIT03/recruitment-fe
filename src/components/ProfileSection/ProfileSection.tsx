import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';
import { memo, ReactElement, ReactNode } from 'react';

import { Summary } from '~/assets/svg';
import Button from '~/components/Button/Button';
import icons from '~/utils/icons';

type TitleType = { title: string; suffixIcon: ReactElement } | string;

export interface IProfileSection {
  header: TitleType;
  content: string;
  buttonTitle: ReactNode;
  buttonAction?: ReactNode;
  onClick?: () => void;
}

const { PlusOutlined } = icons;

const ProfileSection = ({
  header,
  content,
  buttonTitle,
  buttonAction,
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
        {buttonAction}
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        <Summary
          width={96}
          height={96}
          className="rounded-full p-4 bg-gray-100"
        />
        <Paragraph className="text-center text-sm text-sub italic max-w-md">
          {content}
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
