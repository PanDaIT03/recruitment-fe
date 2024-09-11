import { TokenResponse } from '@react-oauth/google';

interface IGoogleUserInfo {
  response: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>;
}

const fetchGoogleUserInfo = async ({ response }: IGoogleUserInfo) => {
  const token = response.access_token;
  if (!token) return;

  const userInfoURL = import.meta.env.VITE_APP_GOOGLE_USERINFO_URL;
  const userInfoResponse = await fetch(userInfoURL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await userInfoResponse.json();
};

export { fetchGoogleUserInfo };
