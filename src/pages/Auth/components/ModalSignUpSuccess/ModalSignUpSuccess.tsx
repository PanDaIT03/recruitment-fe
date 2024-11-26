import { Flex } from 'antd';
import { Dispatch, memo, SetStateAction, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '~/components/Button/Button';
import CongratulationModal from '~/components/Modal/CongratulationModal';
import PATH from '~/utils/path';

interface IProps {
  email: string;
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
}

const ModalSignUpSuccess = ({ isOpenModal, email, setIsOpenModal }: IProps) => {
  const navigate = useNavigate();

  const handleRedirectToSignIn = useCallback(() => {
    setIsOpenModal(false);
    navigate(PATH.USER_SIGN_IN, { state: { email } });
  }, [email]);

  return (
    <CongratulationModal
      isOpen={isOpenModal}
      footer={
        <Flex justify="end" gap={12}>
          <Button title="Đóng" onClick={() => setIsOpenModal(false)} />
          <Button
            fill
            title="Đến trang đăng nhập"
            onClick={handleRedirectToSignIn}
          />
        </Flex>
      }
    >
      <Flex vertical align="center" className="text-center" gap={8}>
        <p className="text-lg font-semibold text-green-600">
          Chúc mừng bạn đã đăng ký tài khoản thành công!
        </p>
        <p className="text-sm text-sub font-medium">
          Bạn có thể chuyển đến trang đăng nhập để sử dụng tài khoản của mình.
        </p>
      </Flex>
    </CongratulationModal>
  );
};

export default memo(ModalSignUpSuccess);
