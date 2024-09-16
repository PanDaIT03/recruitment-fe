import { TokenResponse } from '@react-oauth/google';
import { IGoogleUserInfo } from '~/types/Auth';

interface IGoogleUserInfoResponse {
  response: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>;
}

const fetchGoogleUserInfo = async ({ response }: IGoogleUserInfoResponse) => {
  const token = response.access_token;
  if (!token) return;

  const userInfoURL = import.meta.env.VITE_APP_GOOGLE_USERINFO_URL;
  const userInfoResponse = await fetch(userInfoURL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const userInfo: IGoogleUserInfo = await userInfoResponse.json();
  return userInfo;
};

export { fetchGoogleUserInfo };
