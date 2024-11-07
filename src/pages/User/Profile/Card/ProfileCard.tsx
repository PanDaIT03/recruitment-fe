import { Flex, Image, Popconfirm } from 'antd';
import { memo, ReactElement } from 'react';

import ButtonAction from '~/components/Button/ButtonAction';
import icons from '~/utils/icons';

interface IProps {
  imgUrl?: string;
  content: ReactElement;
  onEdit?: () => void;
  onDelete?: () => void;
}

const { EditOutlined, CloseOutlined, QuestionCircleOutlined } = icons;

const ProfileCard = ({ imgUrl, content, onEdit, onDelete }: IProps) => {
  return (
    <Flex className="gap-x-4 gap-y-2 max-md:flex-col">
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
            onClick={onEdit}
          />
          <Popconfirm
            okText="Có"
            cancelText="Không"
            title="Xoá mục này"
            description="Bạn có chắc chắn muốn xoá mục này?"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={onDelete}
          >
            <ButtonAction
              title={<CloseOutlined className="text-warning cursor-pointer" />}
              className="hover:bg-light-warning"
            />
          </Popconfirm>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default memo(ProfileCard);
