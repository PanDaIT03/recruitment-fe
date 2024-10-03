import { Flex, Image } from 'antd';
import { memo, ReactElement } from 'react';

import ButtonAction from '~/components/Button/ButtonAction';
import icons from '~/utils/icons';

interface IProps {
  imgUrl?: string;
  content: ReactElement;
}

const { EditOutlined, CloseOutlined } = icons;

const ProfileCard = ({ imgUrl, content }: IProps) => {
  return (
    <Flex gap={24}>
      {imgUrl && (
        <Image
          width={64}
          height={64}
          src={imgUrl}
          preview={false}
          className="rounded-lg"
        />
      )}
      <Flex justify="space-between" className="flex-1">
        {content}
        <Flex gap={4}>
          <ButtonAction
            title={<EditOutlined className="text-[#691f74] cursor-pointer" />}
          />
          <ButtonAction
            title={<CloseOutlined className="text-warning cursor-pointer" />}
            className="hover:bg-light-warning"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default memo(ProfileCard);
