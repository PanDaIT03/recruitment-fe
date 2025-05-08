import { Flex, Image, Popconfirm } from 'antd';
import { memo, ReactElement, ReactNode } from 'react';

import ButtonAction from '~/components/Button/ButtonAction';
import { PERMISSION } from '~/enums/permissions';
import { usePermission } from '~/hooks/usePermission';
import icons from '~/utils/icons';

interface IProps {
  imgUrl?: ReactNode;
  content: ReactElement;
  onEdit?: () => void;
  onDelete?: () => void;
}

const { EditOutlined, CloseOutlined, QuestionCircleOutlined } = icons;

const ProfileCard = ({ imgUrl, content, onEdit, onDelete }: IProps) => {
  const { hasPermissions } = usePermission(PERMISSION.EDIT_USER_PROFILE);

  return (
    <Flex className="gap-x-4 gap-y-2 max-md:flex-col">
      {imgUrl && typeof imgUrl === 'string' ? (
        <Image
          width={64}
          height={64}
          src={imgUrl}
          preview={false}
          className="rounded-lg"
        />
      ) : (
        imgUrl
      )}
      <Flex justify="space-between" className="flex-1">
        {content}
        <Flex gap={4}>
          {hasPermissions && (
            <ButtonAction
              title={<EditOutlined className="text-[#691f74] cursor-pointer" />}
              onClick={onEdit}
            />
          )}
          <Popconfirm
            okText="Có"
            cancelText="Không"
            title="Xoá mục này"
            description="Bạn có chắc chắn muốn xoá mục này?"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={onDelete}
          >
            {hasPermissions && (
              <ButtonAction
                title={
                  <CloseOutlined className="text-warning cursor-pointer" />
                }
                className="hover:bg-light-warning"
              />
            )}
          </Popconfirm>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default memo(ProfileCard);
