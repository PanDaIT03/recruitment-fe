import axiosApi from '~/services/axios';
import { UserListResponse } from '~/types/User';
import {
  Achivement,
  ILanguageComboBox,
  ISkillComboBox,
  IUserProfile,
  IUserProfileData,
  UserLanguage,
  UserSkill,
} from '~/types/User/profile';

export type IUserProfileParams = { accessToken: string; refreshToken: string };
export type IUserSkillParams = Pick<UserSkill, 'skillsId' | 'level'>;
export type ISkillParams = Pick<UserSkill, 'skillsId' | 'level'>;
export type IAchievementParams = Pick<Achivement, 'description'>;
export type ILanguageParams = Pick<
  UserLanguage,
  'foreignLanguagesId' | 'level'
>;

export type IUpdateWorkExperience = IUserProfileData & { id: number };
export type IPaginatedLanguage = IPaginatedData<ILanguageComboBox[]>;
export type IPaginatedSkill = IPaginatedData<ISkillComboBox[]>;

const UserApi = {
  // GET
  getUserProfile: async (params: IUserProfileParams): Promise<IUserProfile> => {
    const { accessToken, refreshToken } = params;
    return await axiosApi.get('/users/profile', {
      headers: { Authorization: accessToken, Cookies: refreshToken },
    });
  },
  getAllUser: async (): Promise<UserListResponse> => {
    return await axiosApi.get('/users/all');
  },
  getMyCv: async (): Promise<any> => {
    return await axiosApi.get('/curriculum-vitaes/my-CVs');
  },
  getAllForeignLanguage: async (): Promise<IPaginatedLanguage> => {
    return await axiosApi.get('/foreign-languages/all');
  },
  getAllSkill: async (): Promise<IPaginatedSkill> => {
    return await axiosApi.get('/skills/all');
  },
  getAchievementById: async (id: string) => {
    return await axiosApi.get(`/achivements?id=${id}`);
  },

  // POST
  createAchievement: async (
    params: IAchievementParams
  ): Promise<IBaseResponse> => {
    return await axiosApi.post('/achivements', params);
  },
  createWorkExperience: async (
    params: IUserProfileData
  ): Promise<IBaseResponse> => {
    return await axiosApi.post('/work-experiences', params);
  },
  createUserSkill: async (params: ISkillParams): Promise<IBaseResponse> => {
    return await axiosApi.post('/users-skills', params);
  },
  createForeignLanguage: async (
    params: ILanguageParams
  ): Promise<IBaseResponse> => {
    return await axiosApi.post('/users-foreign-languages', params);
  },

  // PATCH
  updateWorkExperience: async (
    params: IUpdateWorkExperience
  ): Promise<IBaseResponse> => {
    const { id, ...others } = params;
    return await axiosApi.patch(`/work-experiences/${id}`, others);
  },
  updateForeignLanguage: async (
    params: ILanguageParams
  ): Promise<IBaseResponse> => {
    const { foreignLanguagesId: id, level } = params;
    return await axiosApi.patch(`/users-foreign-languages/${id}`, { level });
  },
  updateUserSkill: async (params: ISkillParams): Promise<IBaseResponse> => {
    const { skillsId, level } = params;
    return await axiosApi.patch(`/users-skills/${skillsId}`, { level });
  },

  // DELETE
  deleteWorkExperience: async (id: number): Promise<IBaseResponse> => {
    return await axiosApi.delete(`/work-experiences/${id}`);
  },
  deleteForeignLanguage: async (id: number): Promise<IBaseResponse> => {
    return await axiosApi.delete(`/users-foreign-languages/${id}`);
  },
  deleteUserSkill: async (id: number): Promise<IBaseResponse> => {
    return await axiosApi.delete(`/users-skills/${id}`);
  },
};

export default UserApi;
