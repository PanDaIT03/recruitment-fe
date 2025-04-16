import { Image, Skeleton } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';
import { memo, ReactElement, ReactNode } from 'react';

import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import icons from '~/utils/icons';

type TitleType = { title: string; suffixIcon: ReactElement } | string;

export interface IProfileSection {
  imgUrl: string;
  header: TitleType;
  hint: string;
  loading?: boolean;
  content?: ReactNode;
  tooltipTitle?: string;
  buttonTitle: ReactNode;
  buttonActionTitle?: ReactNode;
  onClick?: () => void;
}

const { PlusOutlined } = icons;

const ProfileSection = ({
  imgUrl,
  hint,
  header,
  loading,
  content,
  buttonTitle,
  tooltipTitle,
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
          <ButtonAction
            tooltipTitle={tooltipTitle}
            title={buttonActionTitle}
            onClick={onClick}
          />
        )}
      </div>
      {loading ? (
        <div className="flex flex-col justify-center items-center gap-4">
          <Skeleton.Image active={loading} style={{ borderRadius: '50%' }} />
          <Skeleton
            active={loading}
            className="max-w-[500px]"
            paragraph={{
              style: { width: '100%', marginTop: '12px' },
            }}
          />
          <Skeleton.Button active={loading} className="!w-full max-w-44" />
        </div>
      ) : content ? (
        content
      ) : (
        <div className="flex flex-col justify-center items-center gap-4">
          <Image
            width={96}
            height={96}
            src={imgUrl}
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
      )}
    </>
  );
};

export default memo(ProfileSection);
