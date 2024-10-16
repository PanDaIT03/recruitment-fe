import axiosApi from '~/services/axios';
import { IUser } from '~/types/Auth';
import {
  Achivement,
  ILanguageComboBox,
  ISkillComboBox,
  IUserProfile,
  IUserProfileData,
  UserLanguage,
  UserSkill,
} from '~/types/User';

export type IUserProfileParams = Pick<IUser, 'accessToken' | 'refreshToken'>;
export type IUserSkillParams = Pick<UserSkill, 'skillsId' | 'level'>;
export type ISkillParams = Pick<UserSkill, 'skillsId' | 'level'>;
export type ILanguageParams = Pick<
  UserLanguage,
  'foreignLanguagesId' | 'level'
>;

export type IUpdateWorkExperience = IUserProfileData & { id: number };
export type IPaginatedLanguage = IPaginatedData<ILanguageComboBox[]>;
export type IPaginatedSkill = IPaginatedData<ISkillComboBox[]>;

const UserApi = {
  getUserProfile: async (params: IUserProfileParams): Promise<IUserProfile> => {
    const { accessToken, refreshToken } = params;

    return await axiosApi.get('/users/profile', {
      headers: { Authorization: accessToken, Cookies: refreshToken },
    });
  },

  getMyCv: async (): Promise<any> => {
    return await axiosApi.get('/curriculum-vitaes/my-CVs');
  },

  createAchievement: async (
    params: Pick<Achivement, 'description'>
  ): Promise<IBaseResponse> => {
    return await axiosApi.post('/achivements', params);
  },
  createWorkExperience: async (
    params: IUserProfileData
  ): Promise<IBaseResponse> => {
    return await axiosApi.post('/work-experiences', params);
  },
  updateWorkExperience: async (
    params: IUpdateWorkExperience
  ): Promise<IBaseResponse> => {
    const { id, ...rest } = params;
    return await axiosApi.patch(`/work-experiences/${id}`, rest);
  },
  deleteWorkExperience: async (id: number): Promise<IBaseResponse> => {
    return await axiosApi.delete(`/work-experiences/${id}`);
  },
  getAllForeignLanguage: async (): Promise<IPaginatedLanguage> => {
    return await axiosApi.get('/foreign-languages/all');
  },
  createForeignLanguage: async (
    params: ILanguageParams
  ): Promise<IBaseResponse> => {
    return await axiosApi.post('/users-foreign-languages', params);
  },
  deleteForeignLanguage: async (id: number): Promise<IBaseResponse> => {
    return await axiosApi.delete(`/users-foreign-languages/${id}`);
  },
  getAllSkill: async (): Promise<IPaginatedSkill> => {
    return await axiosApi.get('/skills/all');
  },
  createUserSkill: async (payload: ISkillParams) => {
    return await axiosApi.post('/users-skills', payload);
  },
};

export default UserApi;
