import { Tooltip } from 'antd';
import Title from 'antd/es/typography/Title';
import React from 'react';
import ButtonAction from '~/components/Button/ButtonAction';
import icons from '~/utils/icons';

const { EditOutlined } = icons;

const Profile: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between">
        <Title level={4}>Thành tích / Kỹ năng nổi bật</Title>
        <Tooltip title="Cập nhật">
          <ButtonAction
            title={<EditOutlined className="text-[#691f74] cursor-pointer" />}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default Profile;
