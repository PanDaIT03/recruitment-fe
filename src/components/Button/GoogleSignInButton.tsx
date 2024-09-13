import {
  OverridableTokenClientConfig,
  useGoogleLogin,
} from '@react-oauth/google';
import { Image } from 'antd';

import { GOOGLE_LOGO } from '~/assets/img';
import { fetchGoogleUserInfo } from '~/utils/functions/fetchGoogleUserInfo';
import Button from './Button';

interface IProps {
  title?: string;
  onClick: (overrideConfig?: OverridableTokenClientConfig) => void;
}

const GoogleSignInButton = ({
  title = 'Tiếp tục với Google',
  onClick,
}: IProps) => {
  const handleClick = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfo = await fetchGoogleUserInfo({ response });
        onClick(userInfo);
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <Button
      title={title}
      iconBefore={
        <Image preview={false} src={GOOGLE_LOGO} width={24} height={24} />
      }
      className="w-full text-[#3c4043] border-[#dadce0] hover:border-[#d2e3fc] hover:bg-[#f7fafe]"
      onClick={() => handleClick()}
    />
  );
};

export default GoogleSignInButton;
