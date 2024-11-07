import { useGoogleLogin } from '@react-oauth/google';
import { Image } from 'antd';
import { memo } from 'react';

import { GOOGLE_LOGO } from '~/assets/img';
import { IUserSignInWithGoogle } from '~/types/Auth';
import { fetchGoogleUserInfo } from '~/utils/functions';
import toast from '~/utils/functions/toast';
import Button from './Button';

interface IProps {
  title?: string;
  onClick: (value: any) => void;
}

const GoogleSignInButton = ({
  title = 'Tiếp tục với Google',
  onClick,
}: IProps) => {
  const handleSignIn = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfo = await fetchGoogleUserInfo({ response });
        if (!userInfo) {
          toast.error('Có lỗi xảy ra khi lấy thông tin từ Google!');
          return;
        }

        const params: IUserSignInWithGoogle = {
          email: userInfo.email,
          fullName: userInfo.name,
        };

        onClick(params);
      } catch (error) {
        console.log(error);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <Button
      title={title}
      iconBefore={
        <Image preview={false} src={GOOGLE_LOGO} width={24} height={24} />
      }
      className="w-full text-[#3c4043] border-[#dadce0] hover:border-[#d2e3fc] hover:bg-[#f7fafe]"
      onClick={() => handleSignIn()}
    />
  );
};

export default memo(GoogleSignInButton);
