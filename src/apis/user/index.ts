import axiosApi from '~/services/axios';
import { IUser } from '~/types/Auth';
import { Achivement, IUserProfile, IUserProfileData } from '~/types/User';

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
  createAchievement: async (
    payload: Pick<Achivement, 'description'>
  ): Promise<IBaseResponse> => {
    return await axiosApi.post('/achivements', payload);
  },
  createWorkExperience: async (
    payload: IUserProfileData
  ): Promise<IBaseResponse> => {
    return await axiosApi.post('/work-experiences', payload);
  },
  updateWorkExperience: async (
    payload: IUserProfileData & { id: number }
  ): Promise<IBaseResponse> => {
    const { id, ...rest } = payload;
    return await axiosApi.patch(`/work-experiences/${id}`, rest);
  },
  deleteWorkExperience: async (id: number) => {
    return await axiosApi.delete(`/work-experiences/${id}`);
  },
};

export default UserApi;
