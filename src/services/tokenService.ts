export const tokenService = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  setAccessToken: (token: string) => localStorage.setItem('accessToken', token),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setRefreshToken: (token: string) =>
    localStorage.setItem('refreshToken', token),
};
