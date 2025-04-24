import { TokenResponse } from '@react-oauth/google';
import dayjs from 'dayjs';
import { IGoogleUserInfo } from '~/types/Auth';

interface IGoogleUserInfoResponse {
  response: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>;
}

export const applyTailwindClass = (props: { type?: string; value: string }) => {
  const { type, value } = props;

  if (!type) return value;
  const isHexColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(value);

  return isHexColor ? `${type}-[${value}]` : value;
};

export const fetchGoogleUserInfo = async ({
  response,
}: IGoogleUserInfoResponse) => {
  const token = response.access_token;
  if (!token) return;

  const userInfoURL = import.meta.env.VITE_APP_GOOGLE_USERINFO_URL;
  const userInfoResponse = await fetch(userInfoURL, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  const userInfo: IGoogleUserInfo = await userInfoResponse.json();
  return userInfo;
};

export const formatCurrencyVN = (amount: number) => {
  if (isNaN(amount)) return '';
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatCurrencyEN = (amount: number) => {
  if (isNaN(amount)) return '';
  return new Intl.NumberFormat('en-US').format(amount);
};

export const formatSalary = (
  salaryMin: NullableNumber,
  salaryMax: NullableNumber
) => {
  if (!salaryMin && !salaryMax) return 'Thương lượng';

  const min = salaryMin ? formatCurrencyVN(salaryMin / 1000) : 0;
  const max = salaryMax ? formatCurrencyVN(salaryMax / 1000) : 0;

  if (min && max) return `${min}k - ${max}k VND`;
  if (min) return `Từ ${min}k VND`;
  if (max) return `${max}k VND`;

  return 'Thương lượng';
};

export const formatDateToBE = (date: string) => {
  if (!date) return '';

  const dayjsDate = dayjs(date);
  return dayjsDate.format('YYYY-MM-DD HH:mm:ss.SSS') + '000';
};
