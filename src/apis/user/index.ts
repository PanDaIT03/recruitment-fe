import { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import axiosApi from '~/services/axios';
import { IGetCVResponse, UserListResponse } from '~/types/User';
import {
  IAchievement,
  IForeignLanguage,
  ILanguageComboBox,
  ISkillComboBox,
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
export interface IDesiredJobParams {
  jobFieldsId: number;
  startAfterOffer: string;
  totalYearExperience: number;
  yearOfBirth: string;
  salaryExpectation: number;
  jobPositionIds: number[];
  jobPlacementIds: number[];
  achivements: string;
  foreignLanguages: {
    level: number;
    id: number;
  }[];
}

export type IGetForeignLanguage = IPaginatedData<IForeignLanguage[]>;
export type IGetWorkExperience = IPaginatedData<IWorkExperience[]>;
export type IGetUserSkill = IPaginatedData<IUserSkill[]>;

export type IUpdateAccountInfo = Partial<{
  file: any;
  fullName: string;
  newPassword: string;
  isChangePassword: boolean;
}>;
export type IUpdatePersonalInfo = {
  fullName: string;
  placementsId: string;
  jobPositionsId: string;
  totalYearExperience?: string;
};
export type IUpdateWorkExperience = IUserProfileData & { id: number };
export type IPaginatedLanguage = IPaginatedData<ILanguageComboBox[]>;
export type IPaginatedSkill = IPaginatedData<ISkillComboBox[]>;

const headers: AxiosHeaders = new AxiosHeaders({
  'Content-Type': 'multipart/form-data',
});

const UserApi = {
  // GET
  getAllUser: async (): Promise<UserListResponse> => {
    return await axiosApi.get('/users/all');
  },
  getMyCv: async (): Promise<IGetCVResponse> => {
    return await axiosApi.get('/curriculum-vitaes/my-CVs');
  },
  getAllForeignLanguage: async (): Promise<IPaginatedLanguage> => {
    return await axiosApi.get('/foreign-languages/all');
  },
  getAllSkill: async (): Promise<IPaginatedSkill> => {
    return await axiosApi.get('/skills/all');
  },
  getAchievementByUser: async () => {
    return await axiosApi.get('/achivements');
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
  createNewDesiredJob: async (params: IDesiredJobParams) => {
    return await axiosApi.post('/desired-jobs', params);
  },
  uploadCV: async (params: FormData) => {
    return await axiosApi.post('/cloudinary/upload/CVs', params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
  updateAccountInfo: async (params: IUpdateAccountInfo | FormData) => {
    return await axiosApi.patch('/users/account-info', params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } as InternalAxiosRequestConfig);
  },
  updatePersonalInfo: async (params: IUpdatePersonalInfo) => {
    return await axiosApi.patch('/users/personal-info', params);
  },
  updateInfoEmployer: async (params: any): Promise<IBaseResponse> => {
    return await axiosApi.patch('/users/personal-info', params, {
      headers,
    });
  },

  // DELETE
  deleteCV: async (id: number): Promise<IBaseResponse> => {
    return await axiosApi.delete(`/curriculum-vitaes/${id}`);
  },
  deleteAchievement: async (id: number): Promise<IBaseResponse> => {
    return await axiosApi.delete(`/achivements/${id}`);
  },
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
