import { AxiosHeaders } from 'axios';
import axiosApi from '~/services/axios';
import { UserListResponse } from '~/types/User';
import {
  IAchievement,
  IForeignLanguage,
  ILanguageComboBox,
  ISkillComboBox,
  IUserProfile,
  IUserProfileData,
  IUserSkill,
  IWorkExperience,
} from '~/types/User/profile';

export type IUserProfileParams = { accessToken: string; refreshToken: string };
export type ISkillParams = Pick<IUserSkill, 'skillsId' | 'level'>;
export type IAchievementParams = Pick<IAchievement, 'description'>;
export type ILanguageParams = Pick<
  IForeignLanguage,
  'foreignLanguagesId' | 'level'
>;

export type IGetForeignLanguage = IPaginatedData<IForeignLanguage[]>;
export type IGetWorkExperience = IPaginatedData<IWorkExperience[]>;
export type IGetUserSkill = IPaginatedData<IUserSkill[]>;

export type IUpdateWorkExperience = IUserProfileData & { id: number };
export type IPaginatedLanguage = IPaginatedData<ILanguageComboBox[]>;
export type IPaginatedSkill = IPaginatedData<ISkillComboBox[]>;

const headers: AxiosHeaders = new AxiosHeaders({
  'Content-Type': 'multipart/form-data',
});

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
  getAchievementByUserId: async (id: number): Promise<IAchievement> => {
    return await axiosApi.get(`/achivements?id=${id}`);
  },
  getLanguageByUserId: async (id: number): Promise<IGetForeignLanguage> => {
    return await axiosApi.get(`/users-foreign-languages/all?usersId=${id}`);
  },
  getUserSkillByUserId: async (id: number): Promise<IGetUserSkill> => {
    return await axiosApi.get(`/users-skills/all?usersId=${id}`);
  },
  getWorkExperienceByUserId: async (
    id: number
  ): Promise<IGetWorkExperience> => {
    return await axiosApi.get(`/work-experiences/all?usersId=${id}`);
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
  updateAchievement: async (params: IAchievement): Promise<IBaseResponse> => {
    const { id, ...others } = params;
    return await axiosApi.patch(`/achivements/${id}`, others);
  },
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
  updateInfoEmployer: async (params: any): Promise<any> => {
    return await axiosApi.patch('/users/personal-info', params, {
      headers,
    });
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
