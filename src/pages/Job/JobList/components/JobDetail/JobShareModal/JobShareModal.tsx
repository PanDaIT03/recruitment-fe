import { Space } from 'antd';
import { memo } from 'react';

import CopyButton from '~/components/Button/CopyButton';
import Input from '~/components/Input/Input';
import Modal, { IModalProps } from '~/components/Modal/Modal';

interface IProps extends IModalProps {
  jobId: number;
}

const JobShareModal = ({ jobId, ...props }: IProps) => {
  const dynamicUrl = `${window.location.origin}/job/${jobId}`;

  return (
    <Modal {...props}>
      <Space direction="vertical">
        <p className="text-sub font-medium">
          Hãy chia sẻ cơ hội này với bạn bè hoặc đồng nghiệp của bạn bằng cách
          chia sẻ link công việc dưới đây:
        </p>
        <Input
          readOnly
          value={dynamicUrl}
          suffix={<CopyButton value={dynamicUrl} />}
        />
      </Space>
    </Modal>
  );
};

export default memo(JobShareModal);
