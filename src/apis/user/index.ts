import axiosApi from '~/services/axios';
import {
  Achivement,
  ILanguageComboBox,
  ISkillComboBox,
  IUserProfile,
  IUserProfileData,
  UserLanguage,
  UserSkill,
} from '~/types/User';

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
    params: IAchievementParams
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
    const { id, ...others } = params;
    return await axiosApi.patch(`/work-experiences/${id}`, others);
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
  updateForeignLanguage: async (
    params: ILanguageParams
  ): Promise<IBaseResponse> => {
    const { foreignLanguagesId: id, level } = params;
    return await axiosApi.patch(`/users-foreign-languages/${id}`, { level });
  },
  deleteForeignLanguage: async (id: number): Promise<IBaseResponse> => {
    return await axiosApi.delete(`/users-foreign-languages/${id}`);
  },
  getAllSkill: async (): Promise<IPaginatedSkill> => {
    return await axiosApi.get('/skills/all');
  },
  createUserSkill: async (params: ISkillParams): Promise<IBaseResponse> => {
    return await axiosApi.post('/users-skills', params);
  },
  updateUserSkill: async (params: ISkillParams): Promise<IBaseResponse> => {
    const { skillsId, level } = params;
    return await axiosApi.patch(`/users-skills/${skillsId}`, { level });
  },
  deleteUserSkill: async (id: number): Promise<IBaseResponse> => {
    return await axiosApi.delete(`/users-skills/${id}`);
  },
};

export default UserApi;
