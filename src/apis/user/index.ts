import axiosApi from '~/services/axios';
import { IUser } from '~/types/Auth';
import { IUserProfile } from '~/types/User';

export type IUserProfileParams = Pick<IUser, 'accessToken' | 'refreshToken'>;

const UserApi = {
  getUserProfile: async (
    payload: IUserProfileParams
  ): Promise<IUserProfile> => {
    const { accessToken, refreshToken } = payload;

    return await axiosApi.get('/users/profile', {
      headers: { Authorization: accessToken, Cookies: refreshToken },
    });
  },
  createWorkExperience: async (payload: any) => {
    return await axiosApi.post('/work-experiences');
  },
};

export default UserApi;
