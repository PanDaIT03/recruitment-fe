import React from 'react';
import { Modal, Divider } from 'antd';
import Button from '~/components/Button/Button';

interface ShareModalProps {
  isVisible: boolean;
  onCancel: () => void;
  jobTitle?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isVisible,
  onCancel,
  jobTitle,
}) => {
  const shareOnFacebook = () => {
    const url =
      'https://www.facebook.com/sharer/sharer.php?u=' +
      encodeURIComponent(window.location.href);
    window.open(url, '_blank');
  };

  const shareOnX = () => {
    const text = 'Check out this amazing link!';
    const url =
      'https://twitter.com/intent/tweet?url=' +
      encodeURIComponent(window.location.href) +
      '&text=' +
      encodeURIComponent(text);
    window.open(url, '_blank');
  };

  return (
    <Modal
      title={
        <p>
          Chia sẻ tin tuyển dụng:
          <span className="text-orange-500"> {jobTitle}</span>
        </p>
      }
      open={isVisible}
      footer={null}
      onCancel={onCancel}
    >
      <Divider />
      <p className="text-sm font-semibold">
        Hãy chia sẻ cơ hội này với bạn bè hoặc đồng nghiệp của bạn bằng cách
        chia sẻ link công việc dưới đây:
      </p>
      <div className="flex gap-4 mt-4">
        <Button
          title="Chia sẻ với Facebook"
          onClick={shareOnFacebook}
          className="w-full"
          fill
        />
        <Button
          title="Chia sẻ với X"
          onClick={shareOnX}
          className="w-full"
          fill
        />
      </div>
      <Divider />
      <Button title="Đóng" onClick={onCancel} className="w-full mt-8" />
    </Modal>
  );
};

export default ShareModal;
